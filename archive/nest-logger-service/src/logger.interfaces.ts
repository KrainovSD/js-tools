import {
  InjectionToken,
  ModuleMetadata,
  OptionalFactoryDependency,
  Type,
} from '@nestjs/common';

import { TransportOption } from './typings';

export interface LoggerModuleOptions {
  transportOptions: TransportOption[];
  defaultMeta?: Record<string, string | undefined>;
}

export interface LoggerOptionFactory {
  createOptions(): Promise<LoggerModuleOptions> | LoggerModuleOptions;
}

export interface AsyncLoggerModuleOptions
  extends Pick<ModuleMetadata, 'imports'> {
  inject?: (InjectionToken | OptionalFactoryDependency)[];
  useExisting?: Type<LoggerOptionFactory>;
  useClass?: Type<LoggerOptionFactory>;
  useFactory?: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...args: any[]
  ) => Promise<LoggerModuleOptions> | LoggerModuleOptions;
}
