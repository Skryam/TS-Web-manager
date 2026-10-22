import { gql, TypedDocumentNode } from "@apollo/client";

export interface Label {
  id: string;
  name: string;
  createdAt: string;
}

interface GetLabelData {
  getLabel: Label;
}

interface GetLabelsData {
  getLabels: Label[];
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

export const GET_LABEL_BY_ID: TypedDocumentNode<GetLabelData> = gql`
  query GetLabelById($id: ID!) {
    getLabel(id: $id) {
      id
      name
      createdAt
    }
  }
`;

export const CREATE_LABEL = gql`
  mutation CreateLabel($data: CreateLabelInput!) {
    createLabel(data: $data) {
      id
      name
    }
  }
`;

export const UPDATE_LABEL = gql`
  mutation UpdateLabel($id: ID!, $data: UpdateLabelInput!) {
    updateLabel(id: $id, data: $data) {
      id
      name
    }
  }
`;

export const DELETE_LABEL = gql`
  mutation DeleteLabel($id: ID!) {
    deleteLabel(id: $id) {
      id
    }
  }
`;