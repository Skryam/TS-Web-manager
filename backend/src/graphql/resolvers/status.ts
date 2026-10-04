import { Resolvers } from '../resolversTypes';
import { AlreadyExists } from '../../exceptions/AlreadyExists';
import { Unauthorized } from '../../exceptions/Unauthorized';

import { createStatusSchema, updateStatusSchema } from './schemas/status';

export const statusResolver: Resolvers = {
  Query: {
    getStatuses: (_, __, { prisma, user }) => {
      if (!user) {
        throw new Unauthorized();
      }
      return prisma.status.findMany();
    },
    getStatus: (_, { id }, { prisma, user }) => {
      if (!user) {
        throw new Unauthorized();    
      }
      return prisma.status.findUnique({ where: { id: Number(id) } });
    },
  },
  Mutation: {
    createStatus: async (_, { data }, { prisma, user }) => {
      if (!user) {
        throw new Unauthorized();
      }

      const validated = createStatusSchema.parse(data);

      const existing = await prisma.status.findUnique({
        where: { name: validated.name },
      });

      if (existing) {
        throw new AlreadyExists();
      }

      return await prisma.status.create({
        data: validated,
        include: { tasksWithStatus: true },
      });
    },
    updateStatus: async (_, { id, data }, { prisma, user }) => {
      if (!user) {
        throw new Unauthorized();
      }

      const validated = updateStatusSchema.parse(data);

      return await prisma.status.update({
        where: { id: Number(id) },
        data: validated,
      });
    },
    deleteStatus: async (_, { id }, { prisma, user }) => {
      if (!user) {
        throw new Unauthorized();
      }

      return prisma.status.delete({
        where: { id: Number(id) },
      });
    },
  },
};