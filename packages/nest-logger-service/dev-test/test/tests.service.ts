import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { LOGGER_PROVIDER_MODULE, LoggerService } from '../../src';

@Injectable()
export class TestsService {
  constructor(
    @Inject(LOGGER_PROVIDER_MODULE)
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
