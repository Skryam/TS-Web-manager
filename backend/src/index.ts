import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import http from 'http';
import cors from 'cors';
import { prisma } from '../lib/prisma';
import session from 'express-session';
import passport from 'passport';
import encrypt from './../lib/secure';
import { Strategy as LocalStrategy } from 'passport-local';
import typeDefs from './graphql/typeDefs';
import { resolvers } from './graphql/resolvers';
import authRoutes from './sessionRoutes';

const app = express();
const httpServer = http.createServer(app);

const server = new ApolloServer({ typeDefs, resolvers });

const main = async () => {
  await server.start();

  app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }));
  app.use(express.json())
  app.use(session({
    secret: process.env.SESSION_KEY || 'fallback-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async ({ req }) => ({
        prisma,
        user: req.user || null,
      }),
    }),
  );

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser( async (id: number, done) => {
    try {
      const user = await prisma.user.findUnique({ where: { id } });
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });

  passport.use(new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    async (email, password, done) => {
      try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return done(null, false);

        const isValid = encrypt(password) === user.passwordDigest;
        if (!isValid) return done (null, false);

        return done (null, user);
      } catch (err) {
        return done (err);
      }
    }
  ));

  app.use('/auth', authRoutes);

  const PORT = 4000
  httpServer.listen(PORT, () => {
    console.log(`Server ready at:`);
    console.log(`   Main page: http://localhost:${PORT}/`);
    console.log(`   GraphQL:   http://localhost:${PORT}/graphql`);
  })
}

main().catch(console.error)