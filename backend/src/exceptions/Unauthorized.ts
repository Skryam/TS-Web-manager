import { GraphQLError } from 'graphql';

import { AppErrorCode } from '../ErrorCodes';

export class Unauthorized extends GraphQLError {
  constructor () {
    super(AppErrorCode.ALREADY_EXISTS);
  }
}