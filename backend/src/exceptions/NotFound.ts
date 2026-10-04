import { GraphQLError } from 'graphql';

import { AppErrorCode } from '../ErrorCodes';

export class NotFound extends GraphQLError {
  constructor () {
    super(AppErrorCode.NOT_FOUND);
  }
}