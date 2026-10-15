import { AppErrorCodes } from '../../enums/AppErrorCodes';

import { RestException } from './RestException';

export class LoginFailed extends RestException {
  constructor() {
    super(AppErrorCodes.LOGIN_FAILED, 401);
  }
}