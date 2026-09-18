import express, { Router } from 'express';
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
        return res.status(500).json({ error: 'LOGIN_FAILED' });
      }
      return res.status(201).json({ id: user.id, email: user.email });
    });
  } catch (e) {
      return res.status(400).json({ error: 'USER_ALREADY_EXISTS' });
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
  console.log(currentUser)

  if (!req.isAuthenticated() || currentUser.id !== Number(req.params.id)) {
    console.log('403')
    return res.status(403);
  }

  try {
    const validated = createUpdateUserPasswordSchema().parse(req.body);

    const user = await prisma.user.findUnique({
      where: { id: currentUser.id },
    });

    if (!user) {
      console.log('404')
      return res.status(404).json({ error: 'USER_NOT_FOUND' });
    }

    if (encrypt(validated.password) !== user.passwordDigest) {
      console.log('422')
      return res.status(422).json({ error: 'INVALID_CURRENT_PASSWORD' });
    }

    const passwordDigest = encrypt(validated.newPassword);
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordDigest },
    })

    return res.json({ ok: true });
  } catch (e: any) {
    if (e.name === 'ZodError') {
      console.log('400')
      return res.status(400).json({
        error: 'VALIDATION_ERROR',
      });
    }
    console.log('500')
    return res.status(500).json({ error: 'INTERNAL_ERROR '});
  }
});

export default router;