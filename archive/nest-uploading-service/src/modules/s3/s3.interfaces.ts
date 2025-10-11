import {
  InjectionToken,
  ModuleMetadata,
  OptionalFactoryDependency,
  Type,
} from '@nestjs/common';
import { S3ClientConfig } from '@aws-sdk/client-s3';

export interface S3OptionsFactory {
  createOptions(): Promise<S3ModuleOptions> | S3ModuleOptions;
}

export interface AsyncS3ModuleOptions extends Pick<ModuleMetadata, 'imports'> {
  inject?: (InjectionToken | OptionalFactoryDependency)[];
  useExisting?: Type<S3OptionsFactory>;
  useClass?: Type<S3OptionsFactory>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useFactory?: (...args: any[]) => Promise<S3ModuleOptions> | S3ModuleOptions;
}

export interface S3ModuleOptions extends S3ClientConfig {
  bucket: string;
}
