import { GraphQLError } from 'graphql';

import { AppErrorCode } from '../ErrorCodes';

export class AlreadyExists extends GraphQLError {
  constructor () {
    super(AppErrorCode.ALREADY_EXISTS);
  }
}