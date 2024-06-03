import { WinstonModule } from 'nest-winston';
import { DynamicModule, Global, Module } from '@nestjs/common';
import { transports } from 'winston';
import { createAsyncOptionsProvider, loggerProvider } from './logger.provider';
import { TransportOption } from './typings';
import { transportFormatJson, transportFormatLogfmt } from './helpers';
import {
  LOGGER_OPTIONS_TOKEN,
  TRANSPORT_FORMATS,
  TRANSPORT_TYPES,
} from './logger.constants';
import {
  AsyncLoggerModuleOptions,
  LoggerModuleOptions,
} from './logger.interfaces';

@Global()
@Module({})
export class LoggerModule {
  public static forRoot(options: LoggerModuleOptions): DynamicModule {
    const customTransports = this.getTransports(options.transportOptions);

    return {
      module: LoggerModule,
      imports: [
        WinstonModule.forRoot({
          transports: customTransports,
          defaultMeta: options.defaultMeta,
        }),
      ],
      controllers: [],
      providers: [loggerProvider],
      exports: [loggerProvider],
    };
  }

  public static forRootAsync(options: AsyncLoggerModuleOptions): DynamicModule {
    return {
      module: LoggerModule,
      imports: [
        ...(options.imports || []),
        WinstonModule.forRootAsync({
          inject: [{ token: LOGGER_OPTIONS_TOKEN, optional: false }],
          useFactory: (moduleOptions: LoggerModuleOptions) => ({
            defaultMeta: moduleOptions.defaultMeta,
            transports: this.getTransports(moduleOptions.transportOptions),
          }),
        }),
      ],
      providers: [...createAsyncOptionsProvider(options), loggerProvider],
      exports: [...createAsyncOptionsProvider(options), loggerProvider],
    };
  }

  private static getTransports(transportOptions: TransportOption[]) {
    return (
      transportOptions?.reduce?.(
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
      ) || []
    );
  }
}
