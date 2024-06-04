import {
  InjectionToken,
  ModuleMetadata,
  OptionalFactoryDependency,
  Type,
} from '@nestjs/common';

export interface JwtModuleOptions {
  accessTokenSecret: string;
  refreshTokenSecret: string;
  expiresAccessToken: string;
  expiresRefreshToken: string;
}

export interface JwtOptionFactory {
  createOptions(): Promise<JwtModuleOptions> | JwtModuleOptions;
}

export interface AsyncJwtModuleOptions extends Pick<ModuleMetadata, 'imports'> {
  inject?: (InjectionToken | OptionalFactoryDependency)[];
  useExisting?: Type<JwtOptionFactory>;
  useClass?: Type<JwtOptionFactory>;
  useFactory?: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...args: any[]
  ) => Promise<JwtModuleOptions> | JwtModuleOptions;
}
