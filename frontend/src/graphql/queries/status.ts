import { gql, TypedDocumentNode } from "@apollo/client";

export interface Status {
  id: string;
  name: string;
  createdAt: string;
}

interface GetStatusData {
  getStatus: Status;
}

interface GetStatusVariables {
  id: string
}

interface GetStatusesData {
  getStatuses: Status[];
}

interface CreateStatusData {
  createStatus: {
    id: string,
    name: string
  }
}

interface CreateStatusVariables {
  data: {
    name: string
  }
}

interface UpdateStatusData {
  updateStatus: {
    id: string,
    name: string
  }
}

interface UpdateStatusArgs {
  id: string,
  data: {
    name: string
  }
}

interface DeleteStatusData {
  deleteStatus: {
    id: string
  }
}

interface DeleteStatusVariables {
  id: string
}

export const GET_STATUS_BY_ID: TypedDocumentNode<GetStatusData, GetStatusVariables> = gql`
  query GetStatusById($id: ID!) {
    getStatus(id: $id) {
      id
      name
      createdAt
    }
  }
`;

export const GET_STATUSES: TypedDocumentNode<GetStatusesData> = gql`
  query GetStatuses {
    getStatuses {
      id
      name
      createdAt
    }
  }
`;

export const CREATE_STATUS: TypedDocumentNode<CreateStatusData, CreateStatusVariables> = gql`
  mutation CreateStatus($data: CreateStatusInput!) {
    createStatus(data: $data) {
      id
      name
    }
  }
`;

export const UPDATE_STATUS: TypedDocumentNode<UpdateStatusData, UpdateStatusArgs> = gql`
  mutation UpdateStatus($id: ID!, $data: UpdateStatusInput!) {
    updateStatus(id: $id, data: $data) {
      id
      name
    }
  }
`;

export const DELETE_STATUS: TypedDocumentNode<DeleteStatusData, DeleteStatusVariables> = gql`
  mutation DeleteStatus($id: ID!) {
    deleteStatus(id: $id) {
      id
    }
  }
`;