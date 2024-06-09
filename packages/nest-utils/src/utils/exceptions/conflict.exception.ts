import { HttpException, HttpStatus } from '@nestjs/common';

export type ConflictExceptionInfo = {
  message: string;
  code: number;
};

export class ConflictException extends HttpException {
  code: number;

  constructor(info: ConflictExceptionInfo) {
    super(info.message, HttpStatus.CONFLICT);
    this.code = info.code;
  }
}
