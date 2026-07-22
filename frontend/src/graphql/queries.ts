import { gql, TypedDocumentNode } from '@apollo/client';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
};

interface GetUserById {
  getUser: User;
};

interface GetUsersData {
  getUsers: User[];
};

export interface Status {
  id: string;
  name: string;
  createdAt: string;
}

interface GetStatusData {
  getStatus: Status;
};                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               

interface GetStatusesData {
  getStatuses: Status[];
};

export interface Label {
  id: string;
  name: string;
  createdAt: string;
}

interface GetLabelData {
  getLabel: Label;
};           

interface GetLabelsData {
  getLabels: Label[];
}

export interface Task {
  id: string;
  name: string;
  description: string;
  status: Status;
  executor: User;
  creator: User;
  labels: Label[]
  createdAt: string;
};

export interface TaskFilterInput {
  statusId?: string | number;
  executorId?: string | number;
  labelId?: (string | number)[]; // Массив ID лейблов
  creatorId?: string | number;
}

interface GetTasksData {
  getTasks: Task[];
}

interface MeData {
  me: {
    id: string;
    email: string;
    firstName: string;
  } | null;
};

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

export const GET_USER_BY_ID: TypedDocumentNode<GetUserById> = gql`
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

export const GET_STATUS_BY_ID: TypedDocumentNode<GetStatusData> = gql`
  query GetStatusById($id: ID!) {
    getStatus(id: $id) {
      id
      name
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

export const GET_STATUSES: TypedDocumentNode<GetStatusesData> = gql`
  query GetStatuses {
    getStatuses {
      id
      name
      createdAt
    }
  }
`;

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

export const GET_TASKS: TypedDocumentNode<GetTasksData, { filter?: TaskFilterInput }> = gql`
  query GetTasks($filter: TaskFilterInput) {
   getTasks(filter: $filter) {
    id
    name
    description

    status {
      name
    }

    executor {
      firstName
      lastName
    }

    creator {
      firstName
      lastName
    }

    labels {
      name
    }

    createdAt
   }
  }
`

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

export const CREATE_STATUS = gql`
  mutation CreateStatus($data: CreateStatusInput!) {
    createStatus(data: $data) { id name }
  }
`;

export const UPDATE_STATUS = gql`
  mutation UpdateStatus($id: ID!, $data: UpdateStatusInput!) {
    updateStatus(id: $id, data: $data) { id name }
  }
`;

export const DELETE_STATUS = gql`
  mutation DeleteStatus($id: ID!) {
    deleteStatus(id: $id) {
      id
    }
  }
`;

export const CREATE_LABEL = gql`
  mutation CreateLabel($data: CreateLabelInput!) {
    createLabel(data: $data) { id name }
  }
`;

export const UPDATE_LABEL = gql`
  mutation UpdateLabel($id: ID!, $data: UpdateLabelInput!) {
    updateLabel(id: $id, data: $data) { id name }
  }
`;

export const DELETE_LABEL = gql`
  mutation DeleteLabel($id: ID!) {
    deleteLabel(id: $id) {
      id
    }
  }
`;

export const CREATE_TASK = gql`
  mutation CreateTask($data: CreateTaskInput!) {
    createTask(data: $data) { id name }
  }
`