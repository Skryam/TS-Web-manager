import { gql, TypedDocumentNode } from "@apollo/client";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
}

interface GetUserById {
  getUser: User;
}

interface GetUsersData {
  getUsers: User[];
}

interface MeData {
  me: {
    id: string;
    email: string;
    firstName: string;
  } | null;
}

interface DeleteUserVariables {
  id: string;
}

interface DeleteUserData {
  deleteUser: {
    id: string;
  }
}

interface UpdateUserData {
  updateUser: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  }
}

interface UpdateUserVariables {
  id: string;
  data: {
    firstName: string
    lastName: string
    email: string
  }
}

export const GET_USERS: TypedDocumentNode<GetUsersData> = gql`
  query GetUsers {
    getUsers {
      id
      email
      firstName
      lastName
      createdAt
    }
  }
`;

export const GET_USER_BY_ID: TypedDocumentNode<GetUserById, { id: string }> = gql`
  query GetUserById($id: ID!) {
    getUser(id: $id) {
      id
      firstName
      lastName
      email
      createdAt
    }
  }
`;

export const GET_ME: TypedDocumentNode<MeData> = gql`
  query GetMe {
    me {
      id
      email
      firstName
    }
  }
`;

export const DELETE_USER: TypedDocumentNode<DeleteUserData, DeleteUserVariables> = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id) {
      id
    }
  }
`;

export const UPDATE_USER: TypedDocumentNode<UpdateUserData, UpdateUserVariables> = gql`
  mutation UpdateUser($id: ID!, $data: UpdateUserInput!) {
    updateUser(id: $id, data: $data) {
      id
      firstName
      lastName
      email
    }
  }
`;