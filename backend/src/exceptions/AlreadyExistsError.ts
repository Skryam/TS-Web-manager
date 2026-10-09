import { GraphQLError } from 'graphql';

import { AppErrorCodes } from '../enums/AppErrorCodes';



export class AlreadyExistsError extends GraphQLError {
  constructor () {
    super(AppErrorCodes.ALREADY_EXISTS);
  }
}