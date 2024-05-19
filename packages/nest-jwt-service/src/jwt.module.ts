import { JwtModule as JWT } from '@nestjs/jwt';
import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from './jwt.service';
import { ModuleOptions } from './jwt.typings';
import { createProvider } from './jwt.provider';
import config from './jwt.config';

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
      imports: [JWT, ConfigModule.forRoot({ load: [config(options)] })],
      providers: [providers],
      exports: [providers],
    };
  }
}
