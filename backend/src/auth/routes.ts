import express, { Router, Request, Response } from 'express';
import { getPrisma } from '../../lib/prisma';
import passport from './passport';
import encrypt from '../../lib/secure';
import { createUserSchema } from '.././graphql/resolvers/schemas/user';

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

export default router;