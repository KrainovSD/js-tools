import { DynamicModule, Global, Module } from '@nestjs/common';

import {
  connectionFactory,
  createAsyncOptionsProvider,
  createOptionProvider,
  serviceProvider,
} from './s3.providers';
import { S3ConnectionService } from './s3.service';
import { AsyncS3ModuleOptions, S3ModuleOptions } from './s3.interfaces';

@Global()
@Module({})
export class S3Module {
  public static forRoot(options: S3ModuleOptions): DynamicModule {
    return {
      module: S3Module,
      providers: [
        createOptionProvider(options),
        connectionFactory,
        S3ConnectionService,
        serviceProvider,
      ],
      exports: [serviceProvider],
    };
  }

  public static forRootAsync(options: AsyncS3ModuleOptions): DynamicModule {
    return {
      module: S3Module,
      imports: options.imports || [],
      providers: [
        ...createAsyncOptionsProvider(options),
        connectionFactory,
        S3ConnectionService,
        serviceProvider,
      ],
      exports: [serviceProvider],
    };
  }
}
