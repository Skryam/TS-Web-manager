import express, { NextFunction, Request, Response, Router } from 'express';
import { ZodError } from 'zod';

import { getPrisma } from '../../lib/prisma';
import encrypt from '../../lib/secure';
import { createUserSchema, createUpdateUserPasswordSchema } from '../graphql/resolvers/schemas/userSchemas';
import { AppErrorCodes } from '../enums/AppErrorCodes';
import { asyncHandler } from '../utils/RouterErrorsHandler';
import { RestException } from '../exceptions/Rest/RestException';

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
    throw AppErrorCodes.ALREADY_EXISTS;
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
      return res.status(500).json({ error: AppErrorCodes.LOGIN_FAILED });
    }
    return res.status(201).json({ id: user.id, email: user.email });
  });
}));

router.post('/login', passport.authenticate('local', { session: true }), asyncHandler(async (req, res) => {
  const user = req.user;
  if (user) {
    return res.json({ id: user.id, email: user.email });
  }
  throw AppErrorCodes.NOT_FOUND;
}));

router.post('/logout', asyncHandler(async (req, res) => {
  req.logout(() => res.json({ success: true }));
}));

router.patch('/users/:id/password', asyncHandler(async (req, res) => {
  const currentUser = req.user as { id: number };

  if (!req.isAuthenticated() || currentUser.id !== Number(req.params.id)) {
    throw AppErrorCodes.UNAUTHORIZED;
  }

  const validated = createUpdateUserPasswordSchema.parse(req.body);

  const user = await prisma.user.findUnique({
    where: { id: currentUser.id },
  });

  if (!user) {
    throw AppErrorCodes.NOT_FOUND;
  }

  if (encrypt(validated.password) !== user.passwordDigest) {
    throw AppErrorCodes.INVALID_CURRENT_PASSWORD;
  }

  const passwordDigest = encrypt(validated.newPassword);
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordDigest },
  });

  return res.json({ ok: true });
}));

router.use((err: Error, req: Request, res: Response, _) => {
  if (err instanceof RestException) {
    return res.status(err.httpCode).json({ error: err.code });
  }
  
  return res.status(500).json({ error: AppErrorCodes.INTERNAL_ERROR});
});

export default router;