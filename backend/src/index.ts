import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import http from 'http';
import cors from 'cors';
import { prisma } from '../lib/prisma';
import session from 'express-session';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';



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
      secret: process.env.SESSION_SECRET || 'secret',
      resave: false,
      saveUninitialized: false,
    }),
    passport.initialize(),
    passport.session(),
  );

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  const PORT = 4000
  httpServer.listen(PORT, () => {
    console.log(`Server ready at:`);
    console.log(`   Main page: http://localhost:${PORT}/`);
    console.log(`   GraphQL:   http://localhost:${PORT}/graphql`);
  })
}

main().catch(console.error)