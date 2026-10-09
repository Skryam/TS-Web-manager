import { Resolvers } from '../resolversTypes';
import { UnauthorizedError } from '../../exceptions/UnauthorizedError';

import { createTaskSchema, updateTaskSchema } from './schemas/task';

interface Filter {
  statusId?: number;
  executorId?: number;
  labels?: object;
  creatorId?: number;
}

export const taskResolver: Resolvers = {
  Query: {
    getTasks: async (_, { filter }, { prisma, user }) => {
      if (!user) {
        throw new UnauthorizedError();
      }

      const where: Filter = {};

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
          in: filter.labelId.map(Number),
        },
        },
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
        labels: task.labels.map((tl) => tl.label),
      }));
    },
    getTask: async (_, { id }, { prisma, user }) => {
      if (!user) {
        throw new UnauthorizedError();
      }

      const task = await prisma.task.findUnique({
        where: { id: Number(id) },
        include: {
          status: true,
          creator: true,
          executor: true,
          labels: { include: { label: true } },
        },
      });

      if (!task) {
        return null;
      }

      return ({
        ...task,
        labels: task.labels.map((tl) => tl.label),
      });

      
    },
  },
  Mutation: {
    createTask: async (_, { data }, { prisma, user }) => {
      if (!user) {
        throw new UnauthorizedError();
      }
      const validated = createTaskSchema.parse(data);
      const { labels, ...taskFields } = validated;

      return prisma.task.create({
        data: {
          ...taskFields,
          creatorId: user.id,
          ...(labels !== undefined && {
            labels: {
              create: labels.map(id => ({ labelId: Number(id) })),
            },
          }),
        },
      });
    },
    updateTask: async (_, { id, data }, { prisma, user }) => {
      if (!user) {
        throw new UnauthorizedError();
      }

      const validated = updateTaskSchema.parse(data);

      const { labels, ...taskFields } = validated;

      return await prisma.task.update({
        where: { id: Number(id) },
        data: {
          ...taskFields,
          ...(labels !== undefined && {
            labels: {
              deleteMany: {},
              create: labels.map(id => ({ labelId: Number(id) })),
            },
          }),
        },
      });
    },
    deleteTask: async (_, { id }, { prisma, user }) => {
      if (!user) {
        throw new UnauthorizedError();
      }

      return prisma.task.delete({
        where: { id: Number(id) },
      });
    },
  },
};