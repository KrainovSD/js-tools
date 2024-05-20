import { Provider } from '@nestjs/common';
import { LOGGER_TOKEN } from './logger.constants';
import { LoggerService } from './logger.service';

export function createLoggerProvider(): Provider {
  return {
    provide: LOGGER_TOKEN,
    useClass: LoggerService,
  };
}
