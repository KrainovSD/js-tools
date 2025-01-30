import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { LoggerFilter, LoggerInterceptor, LoggerModule } from '../src';
import { TestsModule } from './test/tests.module';

@Module({
  imports: [
    LoggerModule.forRoot({
      transportOptions: [{ type: 'console', format: 'logfmt', level: 'debug' }],
      defaultMeta: {
        service: 'test',
      },
    }),
    TestsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: LoggerFilter,
    },
  ],
})
export class AppModule {}
