import { Resolvers, ArgsWithId } from '../resolversTypes';
import { UnauthorizedError } from '../../exceptions/UnauthorizedError';
import { ForbiddenError } from '../../exceptions/ForbiddenError';

import { updateUserSchema, CreateUserInput as UpdateUserInput } from './schemas/userSchemas';


export const userResolver: Resolvers = {
  Query: {
    getUsers: (_, __, { prisma }) => prisma.user.findMany(),
    getUser: (_, { id }, { prisma }) => prisma.user.findUnique({ where: { id: Number(id) } }),
    me: (_, __, { user }) => {
      return user;
    },
  },

  Mutation: {
    updateUser: async (_, { id, data }: ArgsWithId<UpdateUserInput>, { prisma, user }) => {
      if (!user) {
        throw new UnauthorizedError();
      }

      if (Number(id) !== Number(user.id)) {
        throw new ForbiddenError();
      }

      const validated = updateUserSchema.parse(data);

      return prisma.user.update({
        where: { id: Number(id) },
        data: validated,
      });
    },
    deleteUser: async (_, { id }, { prisma, user }) => {
      if (!user) {
        throw new UnauthorizedError();
      }

      if (Number(id) !== Number(user.id)) {
        throw new ForbiddenError();
      }

      return prisma.user.delete({
        where: { id: Number(id) },
      });
    },
  },
};