import { PrismaClient, User } from '../../generated/prisma';

export interface GraphQLContext {
  prisma: PrismaClient;
  user: User | null;
}

interface WithId {
  id: string;
}

type Args<T = any> = {
  data: T;
};

export type ArgsWithId<T = any> = WithId & Args<T>;

export type DefaultArgs<T = any> = ArgsWithId<T>;

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