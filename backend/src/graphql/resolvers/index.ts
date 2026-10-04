import { ResolverFn } from '../resolversTypes';

import { userResolver } from './user';
import { taskResolver } from './task';
import { statusResolver } from './status';
import { labelResolver } from './label';

export interface Resolvers {
  [key: string]: any;

  Query?: Record<string, ResolverFn>;
  Mutation?: Record<string, ResolverFn>;
}

export const getResolvers = (): Resolvers => {
  const controllers = [
    userResolver,
    taskResolver,
    statusResolver,
    labelResolver,
  ];

  return controllers.reduce((acc, controller) => {
    acc.Query = {...acc.Query, ...controller.Query};
    acc.Mutation = {...acc.Mutation, ...controller.Mutation};
    return acc;
  }, { Query: {}, Mutation: {} });
};