import http from 'node:http';

import express from 'express';
import { ApolloServer } from '@apollo/server';
import cors from 'cors';
import session from 'express-session';
import { GraphQLError } from 'graphql';

import { Prisma } from '../generated/prisma/client';

import initGraphql from './graphql/setupGraphql';
import passport from './auth/passport';
import typeDefs from './graphql/typeDefs';
import { getResolvers } from './graphql/resolvers/index';
import authRoutes from './auth/routes';
import { GraphQLPrismaError } from './ErrorCodes';
import { InternalError } from './exceptions/InternalError';

const app = express();
const httpServer = http.createServer(app);
const resolvers = getResolvers();

app.use(express.json());

const server = new ApolloServer({
  typeDefs,
  resolvers,
  includeStacktraceInErrorResponses: false,
  formatError: (_, rawError) => {
    if (rawError instanceof GraphQLError) {
      console.log('KAK EST', rawError);
      return  rawError;
    }

    else if (rawError instanceof Prisma.PrismaClientKnownRequestError) {
      console.log('OBRABOTKA', rawError);
      return GraphQLPrismaError(rawError);
    }
    console.log('InternalError', rawError);
    return new InternalError();
  },
});

const main = async () => {
  app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }));

  app.use(session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 },
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  app.use('/auth', authRoutes);

  await server.start();

  initGraphql(app, server);

  const PORT = 4000;
  httpServer.listen(PORT, () => {
    console.log('Server ready at:');
    console.log(`   Main page: http://localhost:${PORT}/`);
    console.log(`   GraphQL:   http://localhost:${PORT}/graphql`);
  });
};

main().catch(console.error);