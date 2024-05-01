import { HttpException, HttpStatus } from '@nestjs/common';

export type ValidationExceptionMessage = {
  [key: string]: string[];
};

export class ValidationException extends HttpException {
  messages: ValidationExceptionMessage;
  initialData: string;

  constructor(response: ValidationExceptionMessage, initialData: string) {
    super(response, HttpStatus.BAD_REQUEST);
    this.messages = response;
    this.initialData = initialData;
  }
}
