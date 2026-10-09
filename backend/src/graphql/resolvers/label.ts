import { Resolvers, DefaultArgs } from '../resolversTypes';
import { AlreadyExistsError } from '../../exceptions/AlreadyExistsError';
import { UnauthorizedError } from '../../exceptions/UnauthorizedError';

import { createLabelSchema, CreateLabelInput, updateLabelSchema} from './schemas/label';

export const labelResolver: Resolvers = {
  Query: {
    getLabels: (_, __, { prisma, user }) => {
      if (!user) {
        throw new UnauthorizedError();
      }
      return prisma.label.findMany();
    },
    getLabel: (_, { id }, { prisma, user }) => {
      if (!user) {
        throw new UnauthorizedError();
      }
      return prisma.label.findUnique({ where: { id: Number(id) } });
    },
  },
  Mutation: {
    createLabel: async (_, { data }: DefaultArgs<CreateLabelInput>, { prisma, user }) => {
      if (!user) {
        throw new UnauthorizedError();
      }

      const validated = createLabelSchema.parse(data);

      const existing = await prisma.label.findUnique({
        where: { name: validated.name },
      });

      if (existing) {
        throw new AlreadyExistsError();
      }

      return await prisma.label.create({
        data: validated,
      });
    },
    updateLabel: async (_, { id, data }, { prisma, user }) => {
      if (!user) {
        throw new UnauthorizedError();
      }

      const validated = updateLabelSchema.parse(data);
      
      return await prisma.label.update({
        where: { id: Number(id) },
        data: validated,
      });
    },
    deleteLabel: async (_, { id }, { prisma, user }) => {
      if (!user) {
        throw new UnauthorizedError();
      }

      return prisma.label.delete({
        where: { id: Number(id) },
      });
    },
  },
};