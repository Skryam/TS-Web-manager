import { createTaskSchema, updateTaskSchema } from './schemas/task';
import { Resolvers } from '../resolversTypes';
import { handlePrismaError } from './schemas/prismaErrorCodes';

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
        where.labels = { some: { label: { id: {
            in: filter.labelId.map(Number)
            }
          }
        }};
      };

      const tasks = await prisma.task.findMany({
        where,
        include: {
          status: true,
          creator: true,
          executor: true,
          labels: { include: { label: true } },
        },
      });

      return tasks.map((task) => ({
        ...task,
        labels: task.labels.map((tl) => tl.label)
      }))
    },
    getTask: async (_, { id }, { prisma, user }) => {
      if (!user) {
 throw new Error('Unauthorized');
}

      const task = await prisma.task.findUnique({
        where: { id: Number(id) },
        include: {
          status: true,
          creator: true,
          executor: true,
          labels: { include: { label: true } }
        }
      });

      if (!task) {
        return null
      }

      return ({
        ...task,
        labels: task.labels.map((tl) => tl.label)
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

        try {
          return prisma.task.create({
            data: {
              ...taskFields,
              creatorId: user.id,
              ...(labels?.length && {
                labels: {
                  create: labels.map(id => ({ labelId: Number(id) }))
                }
              })
            }
          })
        } catch (err: any) {
          handlePrismaError(err)
        }
    },
    updateTask: async (_, { id, data }, { prisma, user }) => {
      if (!user) {
        throw new Error('Unauthorized');
      }

      const validated = updateTaskSchema.parse(data);

      const { labels, ...taskFields } = validated;

      try {
        return await prisma.task.update({
          where: { id: Number(id) },
          data: {
              ...taskFields,
              ...(labels !== undefined && {
                labels: {
                  deleteMany: {},
                  create: labels.map(id => ({ labelId: Number(id) }))
                }
              })
            },
        });
      } catch (err: any) {
        console.log(Object.entries(err))
        handlePrismaError(err)
      }
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