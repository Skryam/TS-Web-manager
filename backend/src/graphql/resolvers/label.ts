import { Resolvers, DefaultArgs } from '../resolversTypes';
import { GraphQLPrismaError } from '../../ErrorCodes';
import { AlreadyExists } from '../../exceptions/AlreadyExists';
import { Unauthorized } from '../../exceptions/Unauthorized';

import { createLabelSchema, CreateLabelInput, updateLabelSchema} from './schemas/label';

export const labelResolver: Resolvers = {
  Query: {
    getLabels: (_, __, { prisma, user }) => {
      if (!user) {
        throw new Unauthorized();
      }
      return prisma.label.findMany();
    },
    getLabel: (_, { id }, { prisma, user }) => {
      if (!user) {
        throw new Unauthorized();
      }
      return prisma.label.findUnique({ where: { id: Number(id) } });
    },
  },
  Mutation: {
    createLabel: async (_, { data }: DefaultArgs<CreateLabelInput>, { prisma, user }) => {
      if (!user) {
        throw new Unauthorized();
      }

      const validated = createLabelSchema.parse(data);

      const existing = await prisma.label.findUnique({
        where: { name: validated.name },
      });

      if (existing) {
        throw new AlreadyExists();
      }

      return await prisma.label.create({
        data: validated,
      });
    },
    updateLabel: async (_, { id, data }, { prisma, user }) => {
      if (!user) {
        throw new Unauthorized();
      }

      const validated = updateLabelSchema.parse(data);
      
      return await prisma.label.update({
        where: { id: Number(id) },
        data: validated,
      });
    },
    deleteLabel: async (_, { id }, { prisma, user }) => {
      if (!user) {
        throw new Unauthorized();
      }

      return prisma.label.delete({
        where: { id: Number(id) },
      });
    },
  },
};