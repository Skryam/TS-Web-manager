import { GraphQLError, GraphQLFormattedError } from 'graphql';

import { Prisma } from '../../../generated/prisma/client';
import { mapPrismaError } from '../../utils/mapPrismaError';
import { InternalError } from '../../exceptions/InternalError';

export const formatServerError = (_: GraphQLFormattedError, rawError: unknown) => {
  if (rawError instanceof GraphQLError) {
    return rawError;
  }

  else if (rawError instanceof Prisma.PrismaClientKnownRequestError) {
    return mapPrismaError(rawError);
  }
  return new InternalError();
};