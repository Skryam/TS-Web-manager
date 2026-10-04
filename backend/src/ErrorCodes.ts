import { GraphQLError } from 'graphql';

import { Prisma } from '../generated/prisma/client';

import { AlreadyExists } from './exceptions/AlreadyExists';
import { InternalError } from './exceptions/InternalError';
import { NotFound } from './exceptions/NotFound';


export enum AppErrorCode {
  ALREADY_EXISTS = 'ALREADY_EXISTS',
  NOT_FOUND = 'NOT_FOUND',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
}

export enum PrismaErrorCode {
  ALREADY_EXISTS = 'P2002',
  FK_CONSTRAINT = 'P2003',
  NOT_FOUND = 'P2025',
}

const PRISMA_ERROR_MAP: Record<string, new () => GraphQLError> = {
  [PrismaErrorCode.ALREADY_EXISTS]: AlreadyExists,
  [PrismaErrorCode.NOT_FOUND]: NotFound,
};

export const GraphQLPrismaError = (err: Prisma.PrismaClientKnownRequestError): never => {
  const ErrorClass = PRISMA_ERROR_MAP[err.code];

  if (ErrorClass) {
    throw new ErrorClass();
  }

  console.error(err);
  throw new InternalError();
};