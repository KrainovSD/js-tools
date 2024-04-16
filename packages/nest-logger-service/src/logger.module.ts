import { WinstonModule } from 'nest-winston';
import { DynamicModule, Global, Module } from '@nestjs/common';
import { transports } from 'winston';
import { createLoggerProvider } from './logger.provider';
import { TransportOption } from './typings';
import { transportFormatJson, transportFormatLogfmt } from './helpers';
import { TRANSPORT_FORMATS, TRANSPORT_TYPES } from './logger.constants';

export type LoggerModuleOptions = {
  transportOptions: TransportOption[];
  defaultMeta?: Record<string, string | undefined>;
};

@Global()
@Module({})
export class LoggerModule {
  public static forRoot(options: LoggerModuleOptions): DynamicModule {
    const providers = createLoggerProvider();
    const customTransports = options.transportOptions.reduce(
      (
        result: (typeof transports.File | typeof transports.Console)[],
        option,
      ) => {
        let customFormat = transportFormatLogfmt;
        switch (option.format) {
          case TRANSPORT_FORMATS.json: {
            customFormat = transportFormatJson;
            break;
          }
          default: {
            break;
          }
        }

        switch (option.type) {
          case TRANSPORT_TYPES.console: {
            result.push(
              new transports.Console({
                level: option.level,
                format: customFormat,
                handleExceptions: true,
                handleRejections: true,
              }),
            );
            return result;
          }
          case TRANSPORT_TYPES.file: {
            result.push(
              new transports.File({
                dirname: option.dirName,
                filename: option.fileName,
                level: option.level,
                format: customFormat,
                handleExceptions: true,
                handleRejections: true,
              }),
            );
            return result;
          }
          default: {
            return result;
          }
        }
      },
      [],
    );

    return {
      module: LoggerModule,
      imports: [
        WinstonModule.forRoot({
          transports: customTransports,
          defaultMeta: options.defaultMeta,
        }),
      ],
      controllers: [],
      providers: [providers],
      exports: [providers],
    };
  }
}
