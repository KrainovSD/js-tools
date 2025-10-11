import { Provider } from '@nestjs/common';

import { JWT_OPTIONS_TOKEN, JWT_TOKEN } from './jwt.constants';
import { JwtService } from './jwt.service';
import {
  AsyncJwtModuleOptions,
  JwtModuleOptions,
  JwtOptionFactory,
} from './jwt.interfaces';

export const jwtProvider: Provider = {
  provide: JWT_TOKEN,
  useClass: JwtService,
};

export const createOptionsProvider = (options: JwtModuleOptions): Provider => ({
  provide: JWT_OPTIONS_TOKEN,
  useValue: options,
});

export const createAsyncOptionsProvider = (
  options: AsyncJwtModuleOptions,
): Provider[] => {
  if (options.useFactory)
    return [
      {
        provide: JWT_OPTIONS_TOKEN,
        useFactory: options.useFactory,
        inject: options.inject || [],
      },
    ];

  if (options.useClass)
    return [
      { provide: options.useClass, useClass: options.useClass },
      {
        provide: JWT_OPTIONS_TOKEN,
        useFactory: async (optionsFactory: JwtOptionFactory) =>
          optionsFactory.createOptions(),
        inject: [options.useClass],
      },
    ];

  if (options.useExisting)
    return [
      {
        provide: JWT_OPTIONS_TOKEN,
        useFactory: async (optionsFactory: JwtOptionFactory) =>
          optionsFactory.createOptions(),
        inject: [options.useExisting],
      },
    ];

  return [{ provide: JWT_OPTIONS_TOKEN, useValue: {} }];
};
