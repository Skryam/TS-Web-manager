import { GraphQLError } from 'graphql';

import { AppErrorCodes } from '../../enums/AppErrorCodes';



export class InternalError extends GraphQLError {
  constructor () {
    super(AppErrorCodes.INTERNAL_ERROR);
  }
}