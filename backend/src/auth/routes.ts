import express, { Router, Request, Response } from 'express';
import { getPrisma } from '../../lib/prisma';
import passport from './passport';
import encrypt from '../../lib/secure';
import { createUserSchema, createUpdateUserPasswordSchema, UpdateUserPasswordInput } from '.././graphql/resolvers/schemas/user';

const router: Router = express.Router();

router.use(express.json());

const prisma = getPrisma();

router.post('/signup', async (req, res) => {
  try {
    const validated = createUserSchema.parse(req.body);
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
        return res.status(500).json({ error: 'Login failed' });
      }
      return res.status(201).json({ id: user.id, email: user.email });
    });
  } catch (e) {
      console.log(e)
      return res.status(400).json({ error: 'User already exists' });
  }
    });

router.post('/login', passport.authenticate('local', { session: true }), (req, res) => {
  const user = req.user as { id: number; email: string } | undefined;
  if (user) {
    res.json({ id: user.id, email: user.email });
  }
});

router.post('/logout',(req, res) => {
  req.logout(() => res.json({ success: true }));
});

router.patch('/users/:id/password', async (req, res) => {
  const currentUser = req.user as { id: number };

  if (!req.isAuthenticated() || currentUser.id !== Number(req.params.id)) {
    return res.status(403);
  }

  try {
    const validated = createUpdateUserPasswordSchema().parse(req.body);

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (encrypt(validated.password) !== user.passwordDigest) {
      return res.status(422).json({
        code: 'INVALID_CURRENT_PASSWORD',
        message: 'Текущий пароль неверен',
      });
    }

    const passwordDigest = encrypt(validated.newPassword);
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordDigest },
    })

    return res.json({ ok: true });
  } catch (e: any) {
    if (e.name === 'ZodError') {
      return res.status(400).json({
        code: 'VALIDATION_ERROR',
        issues: e.issues.map((i) => ({
          code: i.code,
          path: i.path,
          message: i.message,
        }))
      });
    }

    console.log(e);
    return res.status(500).json({ error: 'Internal error '});
  }
});

export default router;