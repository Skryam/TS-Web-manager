import encrypt from '../../../lib/secure';
import { updateUserSchema } from './schemas/user';
import { Resolvers } from '../resolversTypes';

interface UserQueryArgs {
  id: string;
}

interface UpdateUserMutationArgs {
  id: string;
  data: {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
  }
}

interface DeleteUserMutationArgs {
  id: string;
}

export const userResolver: Resolvers = {
  Query: {
    users: (_, __, { prisma }) => prisma.user.findMany(),
    user: (_, { id }: UserQueryArgs, { prisma }) => prisma.user.findUnique({ where: { id: Number(id) } }),
    me: (_, __, { user }) => {
      return user || null;
    },
  },
  Mutation: {
    updateUser: async (_, { id, data }: UpdateUserMutationArgs, { prisma, user }) => {
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
    deleteUser: async (_, { id }: DeleteUserMutationArgs, { prisma, user }) => {
      if (!user) {
 throw new Error('Unauthorized');
}

      return prisma.user.delete({
        where: { id: Number(id) },
      });
    },
  }
};