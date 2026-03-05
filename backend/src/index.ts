import express, { Request, Response } from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import http from 'http';
import cors from 'cors';
import { prisma } from '../lib/prisma';
import session from 'express-session';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import encrypt from '../lib/secure';


const typeDefs = `#graphql
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    passwordDigest: String!
    createdAt: String!
    updatedAt: String
  }

  input CreateUserInput {
    firstName: String!
    lastName: String!
    email: String!
    password: String!
  }

  type Mutation {
    createUser( data: CreateUserInput! ): User!
  }

  type Query {
    users: [User!]!
  }
`;

const resolvers = {
  Query: {
    users: (_, __, { prisma }) => prisma.user.findMany()
  },

  Mutation: {
    createUser: async (_, { data }, { prisma }) => {
      const { firstName, lastName, email, password } = data;

      const passwordDigest = require('crypto')
        .createHash('sha256')
        .update(password)
        .digest('hex');

      const user = await prisma.user.create({
         data: {
          firstName,
          lastName,
          email,
          passwordDigest,
        },
      });

      return user;
    },
  },
};

const app = express();
const httpServer = http.createServer(app);

const server = new ApolloServer({ typeDefs, resolvers });

const main = async () => {
  await server.start();

  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    express.json(),
    expressMiddleware(server, {
      context: async () => ({ prisma }),
    }),
    session({
      secret: process.env.SESSION_KEY,
      resave: false,
      saveUninitialized: false,
      cookie: { httpOnly: true }
    }),
    passport.initialize(),
    passport.session(),
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
  });

  app.post('/login', express.json(), passport.authenticate('local', { session: true }), (req: Request, res: Response) => {
    res.json({ id: req.user!.id, email: req.user!.email });
  });

  app.post('/logout',(req: Request, res: Response) => {
    req.logout(() => {
      res.json({ success: true });
    });
  });

  const PORT = 4000
  httpServer.listen(PORT, () => {
    console.log(`Server ready at:`);
    console.log(`   Main page: http://localhost:${PORT}/`);
    console.log(`   GraphQL:   http://localhost:${PORT}/graphql`);
  })
}

main().catch(console.error)