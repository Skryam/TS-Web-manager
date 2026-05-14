import { createStatusSchema, updateStatusSchema } from './schemas/status';

export const statusResolver = {
  Query: {
    statuses: (_, __, { prisma, user }) => {
      if (!user) throw new Error('Unauthorized');
      return prisma.status.findMany()
    },
    status: (_, { id }, { prisma, user }) => {
      if (!user) throw new Error('Unauthorized');
      return prisma.status.findUnique({ where: { id: Number(id) } })
    },
  },
  Mutation: {
    createStatus: async (_, { input }, { prisma, user }) => {
      if (!user) throw new Error('Unauthorized');

      try {
        const validated = createStatusSchema.parse(input);

        return prisma.status.create({
          data: validated,
          include: { tasksWithStatus: true }
        });
     } catch (e) {
        console.log(e)
        return e
      }
    },
    updateStatus: async (_, { id, data }, { prisma, user }) => {
      if (!user) throw new Error('Unauthorized');

      const validated = updateStatusSchema.parse(data);

      return prisma.status.update({
        where: { id: Number(id) },
        data: validated,
      });
    },
    deleteStatus: async (_, { id }, { prisma, user }) => {
      if (!user) throw new Error('Unauthorized');

      return prisma.status.delete({
        where: { id: Number(id) },
      });
    },
  }
};