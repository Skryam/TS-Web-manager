import { GraphQLError } from 'graphql';

import { AppErrorCodes } from '../../enums/AppErrorCodes';


export class PrismaValidationError extends GraphQLError {
  constructor () {
    super(AppErrorCodes.PRISMA_VALIDATION_ERROR);
  }
}