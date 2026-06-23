import { PrismaClient, User } from '../../generated/prisma';

export interface GraphQLContext {
  prisma: PrismaClient;
  user: User | null;
}

interface WithId {
  id: string;
}

type Args<T = unknown> = {
  data: T
}

export type ArgsWithId<T = unknown> = WithId & Args<T>;

export type ResolverFn<TArgs, TResult> = (
  parent: any,
  args: TArgs,
  context: GraphQLContext,
  info: any
) => Promise<TResult> | TResult;

export interface Resolvers {
  Query?: Record<string, ResolverFn>;
  Mutation?: Record<string, ResolverFn>;
}