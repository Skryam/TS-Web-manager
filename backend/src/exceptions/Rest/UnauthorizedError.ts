import { AppErrorCodes } from '../../enums/AppErrorCodes';

import { RestException } from './RestException';

export class UnauthorizedError extends RestException {
  constructor() {
    super(AppErrorCodes.UNAUTHORIZED, 401);
  }
}