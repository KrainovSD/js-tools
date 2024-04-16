import { Provider } from '@nestjs/common';
import { LOGGER_PROVIDER_MODULE } from './logger.constants';
import { LoggerService } from './logger.service';

export function createLoggerProvider(): Provider {
  return {
    provide: LOGGER_PROVIDER_MODULE,
    useClass: LoggerService,
  };
}
