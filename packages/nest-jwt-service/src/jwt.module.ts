import { JwtModule as JWT } from '@nestjs/jwt';
import { DynamicModule, Global, Module } from '@nestjs/common';

import { JwtService } from './jwt.service';
import {
  createAsyncOptionsProvider,
  createOptionsProvider,
  jwtProvider,
} from './jwt.provider';
import { AsyncJwtModuleOptions, JwtModuleOptions } from './jwt.interfaces';

@Global()
@Module({
  imports: [JWT],
  providers: [JwtService],
  exports: [JwtService],
})
export class JwtModule {
  public static forRoot(options: JwtModuleOptions): DynamicModule {
    return {
      module: JwtModule,
      imports: [JWT],
      providers: [jwtProvider, createOptionsProvider(options)],
      exports: [jwtProvider],
    };
  }

  public static forRootAsync(options: AsyncJwtModuleOptions): DynamicModule {
    return {
      module: JwtModule,
      imports: [...(options.imports || []), JWT],
      providers: [...createAsyncOptionsProvider(options), jwtProvider],
      exports: [jwtProvider],
    };
  }
}
