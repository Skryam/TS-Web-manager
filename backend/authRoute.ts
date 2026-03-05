import express, { Request, Response } from 'express';
import { prisma } from './lib/prisma';
import encrypt from './lib/secure';
import passport from 'passport';

export default (app) => {
  app.post('/signup', express.json(), async (req: Request, res: Response) => {
    const { firstName, lastName, email, password } = req.body;
    
    try {
    const user = await prisma.user.create({
       data: {
        firstName,
        lastName,
        email,
        passwordDigest: encrypt(password),
      },
    });

    req.login(user, (err) => {
      if (err) return res.status(500).json({ error: 'Login failed' });
      return res.status(201).json({ id: user.id, email: user.email });
    });
  } catch (e) {
    return res.status(400).json({ error: 'User already exists' });
  }
  })
}