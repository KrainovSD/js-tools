import { HttpException, HttpStatus } from '@nestjs/common';

export class ForbiddenException extends HttpException {
  constructor() {
    super('Доступ запрещен', HttpStatus.FORBIDDEN);
  }
}
