import { createTaskSchema, updateTaskSchema } from './schemas/task';
import { Resolvers } from '../resolversTypes';

export const taskResolver: Resolvers = {
  Query: {
    getTasks: async (_, { filter }, { prisma, user }) => {
      if (!user) {
 throw new Error('Unauthorized');
}

      const where: any = {};

      if (filter?.statusId) {
        where.statusId = Number(filter.statusId);
      }
      if (filter?.executorId) {
        where.executorId = Number(filter.executorId);
      }
      if (filter?.isCreatorOnly) {
        where.creatorId = Number(user.id);
      }
      if (filter?.labelId) {
        where.labels = { some: { id: {
          in: filter.labelId.map(Number)
        }
      }};
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
          executor: true,
          labels: true
        }
      })
    },
  },
  Mutation: {
    createTask: async (_, { data }, { prisma, user }) => {
      if (!user) {
 throw new Error('Unauthorized');
}
        const validated = createTaskSchema.parse(data);

        const { labels, ...taskFields } = validated;

        return prisma.task.create({
          data: {
            ...taskFields,
            creatorId: user.id,
            ...(labels?.length && {
              labels: {
                connect: labels.map(id => ({ id: Number(id) }))
              }
            })
          }
        })
    },
    updateTask: async (_, { id, data }, { prisma, user }) => {
      if (!user) {
 throw new Error('Unauthorized');
}

      const validated = updateTaskSchema.parse(data);

      const { labels, ...taskFields } = validated;

      return prisma.task.update({
        where: { id: Number(id) },
        data: {
            ...taskFields,
            ...(labels !== undefined && {
              labels: {
                set: labels.map(id => ({ id: Number(id) }))
              }
            })
          },
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