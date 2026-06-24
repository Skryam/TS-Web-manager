import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

let client: ApolloClient;

export const getClient = () => {
  if (!client) {
    client = new ApolloClient({
      link: new HttpLink({
        uri: 'http://localhost:4000/graphql',
        credentials: 'include',
      }),
      cache: new InMemoryCache()
    });
  }
  return client;
};