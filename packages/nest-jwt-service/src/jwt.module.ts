import { JwtModule as JWT } from '@nestjs/jwt';
import { DynamicModule, Module } from '@nestjs/common';
import { JwtService } from './jwt.service';
import { ModuleOptions } from './jwt.typings';
import { createProvider } from './jwt.provider';

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
      providers: [providers],
      exports: [providers],
    };
  }
}
