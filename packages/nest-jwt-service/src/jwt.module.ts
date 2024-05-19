import { JwtModule as JWT } from '@nestjs/jwt';
import { DynamicModule, Global, Module } from '@nestjs/common';

import { JwtService } from './jwt.service';
import { ModuleOptions } from './jwt.typings';
import { createProvider } from './jwt.provider';
import { JWT_PROVIDER_OPTIONS } from './jwt.constants';

@Global()
@Module({
  imports: [JWT],
  providers: [JwtService],
  exports: [JwtService],
})
export class JwtModule {
  public static forRoot(options: ModuleOptions): DynamicModule {
    const providers = createProvider();

    return {
      module: JwtModule,
      imports: [JWT],
      providers: [
        providers,
        { provide: JWT_PROVIDER_OPTIONS, useValue: options },
      ],
      exports: [providers],
    };
  }
}
