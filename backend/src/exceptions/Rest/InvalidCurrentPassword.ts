import { AppErrorCodes } from '../../enums/AppErrorCodes';

import { RestException } from './RestException';

export class InvalidCurrentPassword extends RestException {
  constructor() {
    super(AppErrorCodes.INVALID_CURRENT_PASSWORD, 422);
  }
}