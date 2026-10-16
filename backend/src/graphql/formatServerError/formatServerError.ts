import { GraphQLError, GraphQLFormattedError } from 'graphql';

import { Prisma } from '../../../generated/prisma/client';
import { mapPrismaError } from '../../utils/mapPrismaError';
import { InternalError } from '../../exceptions/Graphql/InternalError';

export const formatServerError = (_: GraphQLFormattedError, rawError: unknown) => {
  if (rawError instanceof GraphQLError) {
    console.log('СЫРАЯ GraphQLError')
    return rawError;
  }

  else if (rawError instanceof Prisma.PrismaClientKnownRequestError) {
    console.log('СЫРАЯ PrismaClientKnownRequestError')
    return mapPrismaError(rawError);
  }
  console.log('ОБЩАЯ InternalError')
  return new InternalError();
};