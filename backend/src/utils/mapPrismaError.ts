import { GraphQLError } from 'graphql';

import { InternalError } from '../exceptions/Graphql/InternalError';
import { AlreadyExistsError } from '../exceptions/Graphql/AlreadyExistsError';
import { NotFoundError } from '../exceptions/Graphql/NotFoundError';
import { Prisma } from '../../generated/prisma';
import { PrismaErrorCodes } from '../enums/PrismaErrorCodes';

const PRISMA_ERROR_MAP: Record<string, new () => GraphQLError> = {
  [PrismaErrorCodes.ALREADY_EXISTS]: AlreadyExistsError,
  [PrismaErrorCodes.NOT_FOUND]: NotFoundError,
};

export const mapPrismaError = (err: Prisma.PrismaClientKnownRequestError): GraphQLError => {
  const ErrorClass = PRISMA_ERROR_MAP[err.code];

  if (ErrorClass) {
    return new ErrorClass();
  }

  console.error(err);
  return new InternalError();
};