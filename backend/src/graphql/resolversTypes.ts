import { PrismaClient, User } from '../../generated/prisma';

export interface GraphQLContext {
  prisma: PrismaClient;
  user: User | null;
}

export type ResolverFn<TArgs = any, TResult = any> = (
  parent: any,
  args: TArgs,
  context: GraphQLContext,
  info: any
) => Promise<TResult> | TResult;

export interface Resolvers {
  Query?: Record<string, ResolverFn<any, any>>;
  Mutation?: Record<string, ResolverFn<any, any>>;
}