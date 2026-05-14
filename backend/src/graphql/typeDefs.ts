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

    createTask(input: CreateTaskInput!): Task!
    updateTask(id: ID!, data: UpdateTaskInput!): Task!
    deleteTask(id: ID!): Task!

    createStatus(input: CreateStatusInput!): Status!
    updateStatus(id: ID!, data: UpdateStatusInput!): Status!
    deleteStatus(id: ID!): Status!

    createLabel(input: CreateLabelInput!): Label!
    updateLabel(id: ID!, data: UpdateLabelInput!): Label!
    deleteLabel(id: ID!): Label!
  }

  type Query {
    users: [User!]!
    user(id: ID!): User!

    tasks(filter: TaskFilterInput): [Task!]!
    task(id: ID!): Task!

    statuses: [Status!]!
    status(id: ID!): Status!

    labels: [Label!]!
    label(id: ID!): Label!
  }
`;