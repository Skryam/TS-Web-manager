import { AppErrorCodes } from '../../enums/AppErrorCodes';

import { RestException } from './RestException';

export class ValidationError extends RestException {
  constructor() {
    super(AppErrorCodes.VALIDATION_ERROR, 400);
  }
}