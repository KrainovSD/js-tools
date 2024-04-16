import { Inject, Injectable } from '@nestjs/common';
import { LOGGER_PROVIDER_MODULE, LoggerService } from '../../src';

@Injectable()
export class TestsService {
  constructor(
    @Inject(LOGGER_PROVIDER_MODULE)
    private readonly logger: LoggerService,
  ) {}

  async success() {
    return true;
  }

  async error() {
    return false;
  }
}
