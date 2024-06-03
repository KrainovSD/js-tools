import { Provider } from '@nestjs/common';
import { LOGGER_OPTIONS_TOKEN, LOGGER_TOKEN } from './logger.constants';
import { LoggerService } from './logger.service';
import {
  AsyncLoggerModuleOptions,
  LoggerOptionFactory,
} from './logger.interfaces';

export const loggerProvider: Provider = {
  provide: LOGGER_TOKEN,
  useClass: LoggerService,
};

export const createAsyncOptionsProvider = (
  options: AsyncLoggerModuleOptions,
): Provider[] => {
  if (options.useFactory)
    return [
      {
        provide: LOGGER_OPTIONS_TOKEN,
        useFactory: options.useFactory,
        inject: options.inject || [],
      },
    ];

  if (options.useClass)
    return [
      { provide: options.useClass, useClass: options.useClass },
      {
        provide: LOGGER_OPTIONS_TOKEN,
        useFactory: async (optionsFactory: LoggerOptionFactory) =>
          optionsFactory.createOptions(),
        inject: [options.useClass],
      },
    ];

  if (options.useExisting)
    return [
      {
        provide: LOGGER_OPTIONS_TOKEN,
        useFactory: async (optionsFactory: LoggerOptionFactory) =>
          optionsFactory.createOptions(),
        inject: [options.useExisting],
      },
    ];

  return [{ provide: LOGGER_OPTIONS_TOKEN, useValue: {} }];
};
