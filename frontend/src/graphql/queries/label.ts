import { gql, TypedDocumentNode } from "@apollo/client";

export interface Label {
  id: string;
  name: string;
  createdAt: string;
}

interface GetLabelData {
  getLabel: Label;
}

interface GetLabelVariables {
  id: string
}

interface GetLabelsData {
  getLabels: Label[];
}

interface CreateLabelData {
  createStatus: {
    id: string,
    name: string
  }
}

interface CreateLabelVariables {
  data: {
    name: string
  }
}

interface UpdateLabelData {
  updateStatus: {
    id: string,
    name: string
  }
}

interface UpdateLabelVariables {
  id: string,
  data: {
    name: string
  }
}

interface DeleteLabelData {
  deleteStatus: {
    id: string
  }
}

interface DeleteLabelVariables {
  id: string
}

export const GET_LABELS: TypedDocumentNode<GetLabelsData> = gql`
  query GetLabels {
    getLabels {
      id
      name
      createdAt
    }
  }
`;

export const GET_LABEL_BY_ID: TypedDocumentNode<GetLabelData, GetLabelVariables> = gql`
  query GetLabelById($id: ID!) {
    getLabel(id: $id) {
      id
      name
      createdAt
    }
  }
`;

export const CREATE_LABEL: TypedDocumentNode<CreateLabelData, CreateLabelVariables> = gql`
  mutation CreateLabel($data: CreateLabelInput!) {
    createLabel(data: $data) {
      id
      name
    }
  }
`;

export const UPDATE_LABEL: TypedDocumentNode<UpdateLabelData, UpdateLabelVariables> = gql`
  mutation UpdateLabel($id: ID!, $data: UpdateLabelInput!) {
    updateLabel(id: $id, data: $data) {
      id
      name
    }
  }
`;

export const DELETE_LABEL: TypedDocumentNode<DeleteLabelData, DeleteLabelVariables> = gql`
  mutation DeleteLabel($id: ID!) {
    deleteLabel(id: $id) {
      id
    }
  }
`;