import { gql, TypedDocumentNode } from '@apollo/client';

export interface GetTasksData {
  getTasks: {
    id: string;
    name: string;
    description: string;
    status: { name: string };
    executor: { firstName: string, lastName: string };
    creator: { firstName: string, lastName: string };
    labels: { name: string }[];
    createdAt: string;
  }
}

export interface TaskFilterInput {
  statusId?: string;
  executorId?: string;
  labelId?: string[];
  isCreatorOnly?: boolean;
}

interface GetTaskVariables {
  id: string
}

interface GetTaskData {
  getTask: {
    id: string;
    name: string;
    description: string;
    status: { id: string, name: string }
    executor: { id: string, firstName: string, lastName: string };
    creator: { id: string, firstName: string, lastName: string };
    labels: { id: string, name: string }[];
    createdAt: string;
  };
}

interface CreateTaskData {
  createTask: {
    id: string,
    name: string
  }
}

interface CreateTaskVariables {
  data: {
    name: string
    description: string
    statusId: string
    executorId: string
    labels: string[]
  }
}

interface UpdateTaskData {
  updateTask: {
    id: string,
    name: string
  }
}

interface UpdateTaskVariables {
  id: string
  data: {
    name: string
    description: string
    statusId: string
    executorId: string
    labels: string[]
  }
}

interface DeleteTaskData {
  deleteTask: {
    id: string
  }
}

interface DeleteTaskVariables {
  id: string
}

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
`;

export const GET_TASK_BY_ID: TypedDocumentNode<GetTaskData, GetTaskVariables> = gql`
  query GetTaskById($id: ID!) {
    getTask(id: $id) {
      id
      name
      description

      status {
        id
        name
      }

      executor {
        id
        firstName
        lastName
      }

      creator {
        id
        firstName
        lastName
      }

      labels {
        id
        name
      }

      createdAt
    }
  }
`;

export const CREATE_TASK: TypedDocumentNode<CreateTaskData, CreateTaskVariables> = gql`
  mutation CreateTask($data: CreateTaskInput!) {
    createTask(data: $data) {
      id
      name
    }
  }
`;

export const UPDATE_TASK: TypedDocumentNode<UpdateTaskData, UpdateTaskVariables> = gql`
  mutation UpdateTask($id: ID!, $data: UpdateTaskInput!) {
    updateTask(id: $id, data: $data) {
      id
      name
    }
  }
`;

export const DELETE_TASK: TypedDocumentNode<DeleteTaskData, DeleteTaskVariables> = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id) {
      id
    }
  }
`;
