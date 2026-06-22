import { expressMiddleware } from '@as-integrations/express5';
import { getPrisma } from '../../lib/prisma';
import { Express } from 'express';
import { ApolloServer } from '@apollo/server'

const prisma = getPrisma();
  
export default (app: Express, server: ApolloServer) => {
  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async ({ req }) => ({
        prisma,
        user: req.user || null,
      }),
    }),
  )
};