import { createTaskSchema, updateTaskSchema } from './schemas/task';
import { ArgsWithId, Resolvers } from '../resolversTypes';

interface Filter {
  statusId?: string;
  executorId?: string;
  creatorId?: string;
  labelId?: string;
}

export const taskResolver: Resolvers = {
  Query: {
    getTasks: async (_, { data }: ArgsWithId<Filter>, { prisma, user }) => {
      if (!user) {
 throw new Error('Unauthorized');
}

      const where: any = {};

      if (data?.statusId) {
        where.statusId = Number(data.statusId);
      }
      if (data?.executorId) {
        where.executorId = Number(data.executorId);
      }
      if (data?.creatorId) {
        where.creatorId = Number(data.creatorId);
      }
      if (data?.labelId) {
        where.labels = { some: { id: Number(data.labelId)}};
      };

      return prisma.task.findMany({
        where,
        include: {
          status: true,
          creator: true,
          executor: true,
          labels: true
        }
      }); 
    },
    getTask: (_, { id }, { prisma, user }) => {
      if (!user) {
 throw new Error('Unauthorized');
}

      return prisma.task.findUnique({
        where: { id: Number(id) },
        include: {
          status: true,
          creator: true,
          executor: true
        }
      })
    },
  },
  Mutation: {
    createTask: async (_, { input }, { prisma, user }) => {
      if (!user) {
 throw new Error('Unauthorized');
}
        const validated = createTaskSchema.parse(input);

        return prisma.task.create({
          data: { ...validated, creatorId: user.id },
          include: { status: true, creator: true, executor: true, labels: true }
        });
    },
    updateTask: async (_, { id, data }, { prisma, user }) => {
      if (!user) {
 throw new Error('Unauthorized');
}

      const validated = updateTaskSchema.parse(data);

      return prisma.task.update({
        where: { id: Number(id) },
        data: validated,
      });
    },
    deleteTask: async (_, { id }, { prisma, user }) => {
      if (!user) {
 throw new Error('Unauthorized');
}

      return prisma.task.delete({
        where: { id: Number(id) },
      });
    },
  }
};