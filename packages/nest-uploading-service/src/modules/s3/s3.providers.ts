import { Provider } from '@nestjs/common';
import { S3_INSTANCE_TOKEN, S3_OPTIONS_TOKEN, S3_TOKEN } from './s3.constants';
import { S3ConnectionService, S3Service } from './s3.service';
import {
  AsyncS3ModuleOptions,
  S3ModuleOptions,
  S3OptionsFactory,
} from './s3.interfaces';

export const connectionFactory: Provider = {
  provide: S3_INSTANCE_TOKEN,
  useFactory: async (service: S3ConnectionService) => service.connect(),
  inject: [S3ConnectionService],
};

export const serviceProvider: Provider = {
  provide: S3_TOKEN,
  useClass: S3Service,
};

export const createOptionProvider = (options: S3ModuleOptions): Provider => ({
  provide: S3_OPTIONS_TOKEN,
  useValue: options,
});

export const createAsyncOptionsProvider = (
  options: AsyncS3ModuleOptions,
): Provider[] => {
  if (options.useFactory)
    return [
      {
        provide: S3_OPTIONS_TOKEN,
        useFactory: options.useFactory,
        inject: options.inject || [],
      },
    ];

  if (options.useClass)
    return [
      {
        provide: options.useClass,
        useClass: options.useClass,
      },
      {
        provide: S3_OPTIONS_TOKEN,
        useFactory: async (optionsFactory: S3OptionsFactory) =>
          optionsFactory.createOptions(),
        inject: [options.useClass],
      },
    ];

  if (options.useExisting)
    return [
      {
        provide: S3_OPTIONS_TOKEN,
        useFactory: async (optionsFactory: S3OptionsFactory) =>
          optionsFactory.createOptions(),
        inject: [options.useExisting],
      },
    ];

  return [{ provide: S3_OPTIONS_TOKEN, useValue: {} }];
};
