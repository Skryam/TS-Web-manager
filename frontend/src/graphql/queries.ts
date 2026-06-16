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

export const GET_USER_BY_ID = gql`
  query GetUserById($id: ID!) {
    user(id: $id) {
      id
      firstName
      lastName
      email
      createdAt
    }
  }
`;

export const GET_STATUS_BY_ID = gql`
  query GetStatusById($id: ID!) {
    status(id: $id) {
      id
      name
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
      createdAt
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id) {
      id
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $data: UpdateUserInput!) {
    updateUser(id: $id, data: $data) { id firstName lastName email }
  }
`;

export const UPDATE_STATUS = gql`
  mutation UpdateStatus($id: ID!, $data: UpdateStatusInput!) {
    updateStatus(id: $id, data: $data) { id name }
  }
`;