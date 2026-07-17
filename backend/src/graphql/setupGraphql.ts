import { expressMiddleware } from '@as-integrations/express5';
import { getPrisma } from '../../lib/prisma';
import { Express } from 'express';
import { ApolloServer } from '@apollo/server'

const prisma = getPrisma();
  
export default (app: Express, server: ApolloServer) => {
  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async ({ req }) => {

        console.log('=== DEBUG AUTH CONTEXT ===');
        console.log('Cookies:', req.cookies);          // Что видит cookie-parser
        console.log('SignedCookies:', req.signedCookies); // Что видит signed cookies      // ID сессии из куки     // Данные сессии (должен быть user)
        console.log('=========================');

        return {
          prisma,
          user: req.user || null,
        }
      },
    }),
  )
};