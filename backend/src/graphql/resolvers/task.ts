import { createTaskSchema, updateTaskSchema } from './schemas/task';

export const taskResolver = {
  Query: {
    tasks: async (_, { filter }, { prisma, user }) => {
      if (!user) throw new Error('Unauthorized');

      const where: any = {};

      if (filter?.statusId) where.statusId = Number(filter.statusId);
      if (filter?.executorId) where.executorId = Number(filter.executorId);
      if (filter?.creatorId) where.creatorId = Number(filter.creatorId);
      if (filter?.labelId) {
        where.labels = { some: { id: Number(filter.labelId)}};
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
    task: (_, { id }, { prisma, user }) => {
      if (!user) throw new Error('Unauthorized');

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
      if (!user) throw new Error('Unauthorized');

      try {
        const validated = createTaskSchema.parse(input);

        return prisma.task.create({
          data: { ...validated, creatorId: user.id },
          include: { status: true, creator: true, executor: true, labels: true }
        });
     } catch (e) {
        console.log(e)
        return e
      }
    },
    updateTask: async (_, { id, data }, { prisma, user }) => {
      if (!user) throw new Error('Unauthorized');

      const validated = updateTaskSchema.parse(data);

      return prisma.task.update({
        where: { id: Number(id) },
        data: validated,
      });
    },
    deleteTask: async (_, { id }, { prisma, user }) => {
      if (!user) throw new Error('Unauthorized');

      return prisma.task.delete({
        where: { id: Number(id) },
      });
    },
  }
};