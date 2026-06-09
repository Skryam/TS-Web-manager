import { gql } from '@apollo/client';

export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      email
      firstName
      lastName
    }
  }
`;

export const GET_ME = gql`
  query GetMe {
    me {
      id
      email
      fistName
    }
  }
`;