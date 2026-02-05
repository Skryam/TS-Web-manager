import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import http from 'http';
import cors from 'cors';


const typeDefs = `#graphql
  type Query {
    hello: String
  }
`;

const resolvers = {
  Query: {
    hello: () => 'opaaaa'
  },
};

const app = express();
const httpServer = http.createServer(app);

const server = new ApolloServer({ typeDefs, resolvers });
await server.start();

app.use(
  '/graphql',
  cors<cors.CorsRequest>(),
  express.json(),
  expressMiddleware(server)
)

app.get('/', (req, res) => {
  res.send('oopaa')
})

const PORT = 4000
httpServer.listen(PORT, () => {
  console.log(`Server ready at:`);
  console.log(`   Main page: http://localhost:${PORT}/`);
  console.log(`   GraphQL:   http://localhost:${PORT}/graphql`);
})