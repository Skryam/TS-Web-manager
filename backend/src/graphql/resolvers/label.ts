import { createLabelSchema, CreateLabelInput, updateLabelSchema} from './schemas/label';
import { Resolvers, DefaultArgs } from '../resolversTypes';
import { handlePrismaError, throwAlreadyExist } from './schemas/prismaErrorCodes';

export const labelResolver: Resolvers = {
  Query: {
    getLabels: (_, __, { prisma, user }) => {
      if (!user) {
 throw new Error('Unauthorized');
}
      return prisma.label.findMany()
    },
    getLabel: (_, { id }, { prisma, user }) => {
      if (!user) {
 throw new Error('Unauthorized');
}
      return prisma.label.findUnique({ where: { id: Number(id) } })
    }
  },
  Mutation: {
    createLabel: async (_, { data }: DefaultArgs<CreateLabelInput>, { prisma, user }) => {
      if (!user) {
        throw new Error('Unauthorized');
      }

      const validated = createLabelSchema.parse(data);

      const existing = await prisma.label.findUnique({
        where: { name: validated.name }
      })

      if (existing) {
        console.log('ERROR throwAlreadyExist')
        throwAlreadyExist(); 
      }

      try {
        return await prisma.label.create({
          data: validated,
        });
      } catch (err: any) {
        handlePrismaError(err);
      }
    },
    updateLabel: async (_, { id, data }, { prisma, user }) => {
      if (!user) {
        throw new Error('Unauthorized');
      }

      try {
        const validated = updateLabelSchema.parse(data);
        return await prisma.label.update({
          where: { id: Number(id) },
          data: validated,
      });
      } catch (err: any) {
        handlePrismaError(err);
      }
    },
    deleteLabel: async (_, { id }, { prisma, user }) => {
      if (!user) {
        throw new Error('Unauthorized');
      }

      return prisma.label.delete({
        where: { id: Number(id) },
      });
    },
  }
};