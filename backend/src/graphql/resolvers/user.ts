import encrypt from '../../../lib/secure';
import { updateUserSchema, CreateUserInput as UpdateUserInput } from './schemas/user';
import { DefaultArgs, Resolvers } from '../resolversTypes';


export const userResolver: Resolvers = {
  Query: {
    users: (_, __, { prisma }) => prisma.user.findMany(),
    user: (_, { id }, { prisma }) => prisma.user.findUnique({ where: { id: Number(id) } }),
    me: (_, __, { user }) => {
      return user || null;
    },
  },

  Mutation: {
    updateUser: async (_, { id, data }: DefaultArgs<UpdateUserInput>, { prisma, user }) => {
      if (!user) {
 throw new Error('Unauthorized');
}

      const validated = updateUserSchema.parse(data);
      const { password, ...rest } = validated;
      const dataForPrisma = { ...rest, ...(password && { passwordDigest: encrypt(password) }) };

      return prisma.user.update({
        where: { id: Number(id) },
        data: dataForPrisma,
      });
    },
    deleteUser: async (_, { id }, { prisma, user }) => {
      if (!user) {
 throw new Error('Unauthorized');
}

      return prisma.user.delete({
        where: { id: Number(id) },
      });
    },
  }
};