import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { LOGGER_TOKEN, LoggerService } from '../../src';

@Injectable()
export class TestsService {
  constructor(
    @Inject(LOGGER_TOKEN)
    private readonly logger: LoggerService,
  ) {}

  async success() {
    this.logger.info({ message: 'test' });
    return true;
  }

  async error() {
    throw new BadRequestException();
  }
}
