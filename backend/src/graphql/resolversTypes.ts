import { PrismaClient, User } from '../../generated/prisma';

export interface GraphQLContext {
  prisma: PrismaClient;
  user: User | null;
}

export interface DefaultArgs {
  id?: string;
  data?: any;
}

export type ResolverFn<TArgs = DefaultArgs, TResult = any> = (
  parent: any,
  args: TArgs,
  context: GraphQLContext,
  info: any
) => Promise<TResult> | TResult;

export interface Resolvers {
  Query?: Record<string, ResolverFn>;
  Mutation?: Record<string, ResolverFn>;
}