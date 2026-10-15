import express, { NextFunction, Request, Response, Router } from 'express';

import { getPrisma } from '../../lib/prisma';
import encrypt from '../../lib/secure';
import { createUserSchema, createUpdateUserPasswordSchema } from '../graphql/resolvers/schemas/userSchemas';
import { AppErrorCodes } from '../enums/AppErrorCodes';
import { asyncHandler } from '../utils/RouterErrorsHandler';
import { RestException } from '../exceptions/Rest/RestException';
import { AlreadyExistsError } from '../exceptions/Rest/AlreadyExistsError';
import { LoginFailed } from '../exceptions/Rest/LoginFailed';
import { NotFoundError } from '../exceptions/Rest/NotFoundError';
import { UnauthorizedError } from '../exceptions/Rest/UnauthorizedError';
import { InvalidCurrentPassword } from '../exceptions/Rest/InvalidCurrentPassword';

import passport from './passport';

const router: Router = express.Router();

router.use(express.json());

const prisma = getPrisma();

router.post('/signup', asyncHandler(async (req, res) => { 
  const validated = createUserSchema.parse(req.body);

  const existing = await prisma.user.findUnique({
    where: { email: validated.email },
  });
  
  if (existing) {
    throw new AlreadyExistsError;
  }

  const passwordDigest = encrypt(validated.password);

  const user = await prisma.user.create({
    data: {
      firstName: validated.firstName,
      lastName: validated.lastName,
      email: validated.email,
      passwordDigest,
    },
  });

  req.login(user, (err) => {
    if (err) {
      throw new LoginFailed;
    }
    return res.status(201).json({ id: user.id, email: user.email });
  });
}));

router.post('/login', passport.authenticate('local', { session: true }), asyncHandler(async (req, res) => {
  const user = req.user as {id; email};
  if (user) {
    return res.json({ id: user.id, email: user.email });
  }
  throw new NotFoundError;
}));

router.post('/logout', asyncHandler(async (req, res) => {
  req.logout(() => res.json({ success: true }));
}));

router.patch('/users/:id/password', asyncHandler(async (req, res) => {
  const currentUser = req.user as { id: number };

  if (!req.isAuthenticated() || currentUser.id !== Number(req.params.id)) {
    throw new UnauthorizedError;
  }

  const validated = createUpdateUserPasswordSchema.parse(req.body);

  const user = await prisma.user.findUnique({
    where: { id: currentUser.id },
  });

  if (!user) {
    throw new NotFoundError;
  }

  if (encrypt(validated.password) !== user.passwordDigest) {
    throw new InvalidCurrentPassword;
  }

  const passwordDigest = encrypt(validated.newPassword);
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordDigest },
  });

  return res.json({ ok: true });
}));

router.use((err: Error, req: Request, res: Response, _: NextFunction) => {
  if (err instanceof RestException) {
    return res.status(err.httpCode).json({ error: err.code });
  }
  
  return res.status(500).json({ error: AppErrorCodes.INTERNAL_ERROR});
});

router.use((_, res, next) => {
  if (res.headersSent) {
    return next();
  }
  
  if (res.locals.data !== undefined) {
    return res
      .status(res.locals.statusCode || 200)
      .json(res.locals.data);
  }

  next();
});

export default router;