import { GraphQLError } from 'graphql';

import { PrismaErrorCodes } from '../enums/PrismaErrorCodes';
import { Prisma } from '../../generated/prisma';


import { InternalError } from './InternalError';
import { AlreadyExistsError } from './AlreadyExistsError';
import { NotFoundError } from './NotFoundError';

const PRISMA_ERROR_MAP: Record<string, new () => GraphQLError> = {
  [PrismaErrorCodes.ALREADY_EXISTS]: AlreadyExistsError,
  [PrismaErrorCodes.NOT_FOUND]: NotFoundError,
};

export class GraphQLPrismaError {
  static handle(err: Prisma.PrismaClientKnownRequestError): never {
    const ErrorClass = PRISMA_ERROR_MAP[err.code];

    if (ErrorClass) {
      throw new ErrorClass();
    }

    console.error(err);
    throw new InternalError();
  }
};