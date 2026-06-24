import { PrismaClient, User } from '../../generated/prisma';

export interface GraphQLContext {
  prisma: PrismaClient;
  user: User | null;
}

interface WithId {
  id: string;
}

type Args<T = Record<string, unknown>> = {
  data: T;
};

export type ArgsWithId<T = Args> = WithId & Args<T>;

export type DefaultArgs<T = any> = Partial<ArgsWithId<T>>;

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