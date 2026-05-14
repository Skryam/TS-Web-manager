import { userResolver } from "./user";
import { taskResolver } from "./task";
import { statusResolver } from "./status";
import { labelResolver } from "./label";

const controllers = [
  userResolver,
  taskResolver,
  statusResolver,
  labelResolver
]

export const resolvers = controllers.reduce((acc, controller) => {
  acc.Query = {...acc.Query, ...controller.Query};
  acc.Mutation = {...acc.Mutation, ...controller.Mutation};
  return acc
}, { Query: {}, Mutation: {} });
console.log(resolvers)