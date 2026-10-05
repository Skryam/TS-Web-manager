import { Resolvers, ArgsWithId } from '../resolversTypes';
import { updateUserSchema, CreateUserInput as UpdateUserInput } from '../../userSchema';
import { Unauthorized } from '../../exceptions/Unauthorized';
import { Forbidden } from '../../exceptions/Forbidden';


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
        throw new Unauthorized();
      }

      if (Number(id) !== Number(user.id)) {
        throw new Forbidden();
      }

      const validated = updateUserSchema.parse(data);

      return prisma.user.update({
        where: { id: Number(id) },
        data: validated,
      });
    },
    deleteUser: async (_, { id }, { prisma, user }) => {
      if (!user) {
        throw new Unauthorized();
      }

      if (Number(id) !== Number(user.id)) {
        throw new Forbidden();
      }

      return prisma.user.delete({
        where: { id: Number(id) },
      });
    },
  },
};