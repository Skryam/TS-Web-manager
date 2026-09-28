import { createStatusSchema, updateStatusSchema } from './schemas/status';
import { handlePrismaError } from './schemas/prismaErrorCodes';

export const statusResolver = {
  Query: {
    getStatuses: (_, __, { prisma, user }) => {
      if (!user) {
 throw new Error('Unauthorized');
}
      return prisma.status.findMany()
    },
    getStatus: (_, { id }, { prisma, user }) => {
      if (!user) {
 throw new Error('Unauthorized');
}
      return prisma.status.findUnique({ where: { id: Number(id) } })
    },
  },
  Mutation: {
    createStatus: async (_, { data }, { prisma, user }) => {
      if (!user) {
        throw new Error('Unauthorized');
      }

        const validated = createStatusSchema.parse(data);

        try {
          return await prisma.status.create({
            data: validated,
            include: { tasksWithStatus: true }
          });
        } catch (err: any) {
            console.log(err)
            handlePrismaError(err)
        }
    },
    updateStatus: async (_, { id, data }, { prisma, user }) => {
      if (!user) {
        throw new Error('Unauthorized');
      }

      const validated = updateStatusSchema.parse(data);

      try {
        return await prisma.status.update({
          where: { id: Number(id) },
          data: validated,
        });
      } catch (err: any) {
        console.log(err)
        handlePrismaError(err)
      }
    },
    deleteStatus: async (_, { id }, { prisma, user }) => {
      if (!user) {
 throw new Error('Unauthorized');
}

      return prisma.status.delete({
        where: { id: Number(id) },
      });
    },
  }
};