import { DefaultArgs, Resolvers } from '../resolversTypes';
import { AlreadyExistsError } from '../../exceptions/Graphql/AlreadyExistsError';
import { UnauthorizedError } from '../../exceptions/Graphql/UnauthorizedError';

import { CreateStatusInput, createStatusSchema, UpdateStatusInput, updateStatusSchema } from './schemas/status';

export const statusResolver: Resolvers = {
  Query: {
    getStatuses: (_, __, { prisma, user }) => {
      if (!user) {
        throw new UnauthorizedError();
      }
      return prisma.status.findMany();
    },
    getStatus: (_, { id }: DefaultArgs, { prisma, user }) => {
      if (!user) {
        throw new UnauthorizedError();    
      }
      return prisma.status.findUnique({ where: { id: Number(id) } });
    },
  },
  Mutation: {
    createStatus: async (_, { data }: DefaultArgs<CreateStatusInput>, { prisma, user }) => {
      if (!user) {
        throw new UnauthorizedError();
      }

      const validated = createStatusSchema.parse(data);

      const existing = await prisma.status.findUnique({
        where: { name: validated.name },
      });

      if (existing) {
        throw new AlreadyExistsError();
      }

      return await prisma.status.create({
        data: validated,
        include: { tasksWithStatus: true },
      });
    },
    updateStatus: async (_, { id, data }: DefaultArgs<UpdateStatusInput>, { prisma, user }) => {
      if (!user) {
        throw new UnauthorizedError();
      }

      const validated = updateStatusSchema.parse(data);

      return await prisma.status.update({
        where: { id: Number(id) },
        data: validated,
      });
    },
    deleteStatus: async (_, { id }: DefaultArgs, { prisma, user }) => {
      if (!user) {
        throw new UnauthorizedError();
      }

      return prisma.status.delete({
        where: { id: Number(id) },
      });
    },
  },
};