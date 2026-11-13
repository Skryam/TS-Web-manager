import express, { NextFunction, Request, Response, Router } from 'express';

import { getPrisma } from '../../lib/prisma';
import encrypt from '../../lib/secure';
import { createUserSchema, createUpdateUserPasswordSchema } from '../graphql/resolvers/schemas/users';
import { AppErrorCodes } from '../enums/AppErrorCodes';
import { RestException } from '../exceptions/rest/RestException';
import { AlreadyExistsError } from '../exceptions/rest/AlreadyExistsError';
import { LoginFailed } from '../exceptions/rest/LoginFailed';
import { NotFoundError } from '../exceptions/rest/NotFoundError';
import { UnauthorizedError } from '../exceptions/rest/UnauthorizedError';
import { InvalidCurrentPassword } from '../exceptions/rest/InvalidCurrentPassword';
import { asyncHandler } from '../utils/routerErrorsHandler';

import passport from './passport';

const router: Router = express.Router();

router.use(express.json());

const prisma = getPrisma();

router.post('/signup', asyncHandler(async (req, res, next) => {
  const validated = createUserSchema.parse(req.body);

  const existing = await prisma.user.findUnique({
    where: { email: validated.email },
  });
  if (existing) {
    throw new AlreadyExistsError();
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
      throw new LoginFailed();
    }
    res.locals.data = { id: user.id, email: user.email };
    next();
  });
}));

router.post('/login', passport.authenticate('local', { session: true }), asyncHandler(async (req, res, next) => {
  const user = req.user as {id; email};
  if (user) {
    res.locals.data = { id: user.id, email: user.email };
    return next();
  }
  throw new NotFoundError();
}));

router.post('/logout', asyncHandler(async (req, res, next) => {
  req.logout(() => {
    res.locals.isValid = true;
    next();
  });
}));

router.patch('/users/:id/password', asyncHandler(async (req, res, next) => {
  const currentUser = req.user as { id: number };

  if (!req.isAuthenticated() || currentUser.id !== Number(req.params.id)) {
    throw new UnauthorizedError();
  }

  const validated = createUpdateUserPasswordSchema.parse(req.body);

  const user = await prisma.user.findUnique({
    where: { id: currentUser.id },
  });

  if (!user) {
    throw new NotFoundError();
  }

  if (encrypt(validated.password) !== user.passwordDigest) {
    throw new InvalidCurrentPassword();
  }

  const passwordDigest = encrypt(validated.newPassword);
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordDigest },
  });

  res.locals = { ok: true };
  next();
}));

router.use((err: Error, req: Request, res: Response, _: NextFunction) => {
  if (err instanceof RestException) {
    return res.status(err.httpCode).json({ error: err.code });
  }
  console.error(err);
  return res.status(500).json({ error: AppErrorCodes.INTERNAL_ERROR});
});

router.use((_, res, next) => {
  if (res.headersSent) {
    return;
  }
  if (res.locals.data !== undefined) {
    return res
      .status(res.locals.statusCode || 200)
      .json(res.locals.data);
  }

  next();
});

router.use((req, res) => {
  if (res.headersSent) {
    return;
  }
  res.status(404).json({ error: AppErrorCodes.NOT_FOUND });
});

export default router;