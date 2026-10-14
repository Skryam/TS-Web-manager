import { AppErrorCodes } from '../../enums/AppErrorCodes';

class RestException extends Error {
  constructor(
    super()
    public code: AppErrorCodes, 
    public httpCode: number,
  ) {}
}