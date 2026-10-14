import { AppErrorCodes } from '../../enums/AppErrorCodes';

import { RestException } from './RestException';

export class NotFoundError extends RestException {
  constructor() {
    super(AppErrorCodes.NOT_FOUND, 404);
  }
}