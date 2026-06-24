import { createLabelSchema, CreateLabelInput, updateLabelSchema} from './schemas/label';
import { Resolvers, DefaultArgs } from '../resolversTypes';

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

      try {
        const validated = createLabelSchema.parse(data);

        return prisma.label.create({
          data: validated,
          include: { tasksWithLabels: true }
        });
     } catch (e) {
        console.log(e)
        throw e
      }
    },
    updateLabel: async (_, { id, data }, { prisma, user }) => {
      if (!user) {
 throw new Error('Unauthorized');
}

      const validated = updateLabelSchema.parse(data);

      return prisma.label.update({
        where: { id: Number(id) },
        data: validated,
      });
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