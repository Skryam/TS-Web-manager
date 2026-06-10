import { gql } from '@apollo/client';

export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      email
      firstName
      lastName
      createdAt
    }
  }
`;

export const GET_ME = gql`
  query GetMe {
    me {
      id
      email
      firstName
    }
  }
`;

export const GET_STATUSES = gql`
  query GetStatuses {
    statuses {
      id
      name
    }
  }
`