import { AppErrorCodes } from '../../enums/AppErrorCodes';

export class RestException extends Error {
  constructor(
    public code: AppErrorCodes, 
    public httpCode: number,
  ) {
    super(`Rest exception occured with code ${code} and httpCode ${httpCode}`);
  }
}