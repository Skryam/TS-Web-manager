import { GraphQLError } from 'graphql';

import { AppErrorCodes } from '../enums/AppErrorCodes';



export class NotFoundError extends GraphQLError {
  constructor () {
    super(AppErrorCodes.NOT_FOUND);
  }
}