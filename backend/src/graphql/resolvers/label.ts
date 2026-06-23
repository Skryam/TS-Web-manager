import { createLabelSchema, updateLabelSchema} from './schemas/label';
import { Resolvers } from '../resolversTypes';

export const labelResolver: Resolvers = {
  Query: {
    labels: (_, __, { prisma, user }) => {
      if (!user) {
 throw new Error('Unauthorized');
}
      return prisma.label.findMany()
    },
    label: (_, { id }, { prisma, user }) => {
      if (!user) {
 throw new Error('Unauthorized');
}
      return prisma.label.findUnique({ where: { id: Number(id) } })
    }
  },
  Mutation: {
    createLabel: async (_, { input }, { prisma, user }) => {
      if (!user) {
 throw new Error('Unauthorized');
}

      try {
        const validated = createLabelSchema.parse(input);

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