import { userResolver } from "./user";
import { taskResolver } from "./task";
import { statusResolver } from "./status";
import { labelResolver } from "./label";

export default () => {
  const controllers = [
  userResolver,
  taskResolver,
  statusResolver,
  labelResolver
  ];

  return controllers.reduce((acc, controller) => {
    acc.Query = {...acc.Query, ...controller.Query};
    acc.Mutation = {...acc.Mutation, ...controller.Mutation};
    return acc
  }, { Query: {}, Mutation: {} });
}