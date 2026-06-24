export default `#graphql
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    createdAt: String!
    updatedAt: String
  }

  type Task {
    id: ID!
    name: String!
    description: String
    status: Status!
    executor: User
    creator: User!
    labels: [Label!]!
    createdAt: String!
  }

  type Status {
    id: ID!
    name: String!
    createdAt: String!
    tasksWithStatus: [Task!]!
  }

  type Label {
    id: ID!
    name: String!
    createdAt: String!
    tasksWithLabels: [Task!]!
  }


  
  input CreateUserInput {
    firstName: String!
    lastName: String!
    email: String!
    password: String!
  }

  input UpdateUserInput {
    firstName: String
    lastName: String
    email: String
    password: String
  }

  input CreateTaskInput {
    name: String!
    description: String
    statusId: ID!
    executorId: ID
    labels: [ID]
  }

  input UpdateTaskInput {
    name: String
    description: String
    statusId: ID
    executorId: ID
    labels: [ID]
  }

  input CreateStatusInput {
    name: String!
  }

  input UpdateStatusInput {
    name: String
  }

  input CreateLabelInput {
    name: String!
  }

  input UpdateLabelInput {
    name: String
  }

  input TaskFilterInput {
    statusId: ID
    executorId: ID
    labelId: [ID]
    creatorId: ID
  }

  type Mutation {
    createUser(data: CreateUserInput!): User!
    updateUser(id: ID!, data: UpdateUserInput!): User!
    deleteUser(id: ID!): User!

    createTask(data: CreateTaskInput!): Task!
    updateTask(id: ID!, data: UpdateTaskInput!): Task!
    deleteTask(id: ID!): Task!

    createStatus(data: CreateStatusInput!): Status!
    updateStatus(id: ID!, data: UpdateStatusInput!): Status!
    deleteStatus(id: ID!): Status!

    createLabel(data: CreateLabelInput!): Label!
    updateLabel(id: ID!, data: UpdateLabelInput!): Label!
    deleteLabel(id: ID!): Label!
  }

  type Query {
    me: User
    getUsers: [User!]!
    getUser(id: ID!): User!

    getTasks(filter: TaskFilterInput): [Task!]!
    getTask(id: ID!): Task!

    getStatuses: [Status!]!
    getStatus(id: ID!): Status!

    getLabels: [Label!]!
    getLabel(id: ID!): Label!
  }
`;