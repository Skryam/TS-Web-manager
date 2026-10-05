import { GraphQLError } from 'graphql';

import { AppErrorCode } from '../ErrorCodes';

export class Forbidden extends GraphQLError {
  constructor () {
    super(AppErrorCode.FORBIDDEN);
  }
}