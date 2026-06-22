import express from 'express';
import { ApolloServer } from '@apollo/server';
import initGraphql from './graphql/setupGraphql';
import http from 'http';
import cors from 'cors';
import session from 'express-session';
import passport from './auth/passport';
import typeDefs from './graphql/typeDefs';
import getResolvers from './graphql/resolvers/index';
import authRoutes from './auth/routes';

const app = express();
const httpServer = http.createServer(app);
const resolvers = getResolvers();

const server = new ApolloServer({ typeDefs, resolvers });

const main = async () => {
  await server.start();

  app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }));

  initGraphql(app, server);

  app.use(express.json())

  app.use(session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  app.use('/auth', authRoutes);

  const PORT = 4000
  httpServer.listen(PORT, () => {
    console.log(`Server ready at:`);
    console.log(`   Main page: http://localhost:${PORT}/`);
    console.log(`   GraphQL:   http://localhost:${PORT}/graphql`);
  })
}

main().catch(console.error)