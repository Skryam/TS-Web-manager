import { AppErrorCodes } from '../../enums/AppErrorCodes';

import { RestException } from './RestException';

export class AlreadyExistsError extends RestException {
  constructor() {
    super(AppErrorCodes.ALREADY_EXISTS, 409);
  }
}