import { GraphQLError } from 'graphql';

import { AppErrorCodes } from '../enums/AppErrorCodes';


export class ForbiddenError extends GraphQLError {
  constructor () {
    super(AppErrorCodes.FORBIDDEN);
  }
}