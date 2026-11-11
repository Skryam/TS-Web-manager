import { GraphQLError, GraphQLFormattedError } from 'graphql';

import { Prisma } from '../../../generated/prisma/client';
import { mapPrismaError } from '../../utils/mapPrismaError';
import { InternalError } from '../../exceptions/Graphql/InternalError';
import { AppErrorCodes } from '../../enums/AppErrorCodes';
import { ValidationError } from '../../exceptions/Rest/ValidationError';

const APP_ERROR_CODES = new Set<string>(Object.values(AppErrorCodes));

export const formatServerError = (_: GraphQLFormattedError, rawError: unknown) => {
  if (rawError instanceof GraphQLError && APP_ERROR_CODES.has(rawError.message)) {
    console.log('КАСТОМНАЯ ГРАФ')
    return rawError;
  }

  const original =
    rawError instanceof GraphQLError ? rawError.originalError : rawError;

  if (original instanceof Prisma.PrismaClientKnownRequestError) {
    console.log('PrismaClientKnownRequestError')
    return mapPrismaError(original);
  }

  if (original instanceof Prisma.PrismaClientValidationError) {
    console.log('PrismaClientValidationError')
    return new ValidationError();
  }

  console.error('[UNHANDLED]', original);
  return new InternalError();
};