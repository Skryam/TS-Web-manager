import { GraphQLError } from 'graphql';

import { AppErrorCode } from '../ErrorCodes';

export class InternalError extends GraphQLError {
  constructor () {
    super(AppErrorCode.INTERNAL_ERROR);
  }
}