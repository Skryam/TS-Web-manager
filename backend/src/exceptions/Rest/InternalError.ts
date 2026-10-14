import { AppErrorCodes } from '../../enums/AppErrorCodes';

import { RestException } from './RestException';

export class InternalError extends RestException {
  constructor() {
    super(AppErrorCodes.INTERNAL_ERROR, 500);
  }
}