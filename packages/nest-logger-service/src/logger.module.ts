import { WinstonModule } from 'nest-winston';
import { DynamicModule, Global, Module, Type } from '@nestjs/common';
import { transports } from 'winston';
import { createLoggerProvider } from './logger.provider';
import { TransportOption } from './typings';
import { transportFormatJson, transportFormatLogfmt } from './helpers';
import { TRANSPORT_FORMATS, TRANSPORT_TYPES } from './logger.constants';
import { LoggerModuleOptions } from './logger.interfaces';

@Global()
@Module({})
export class LoggerModule {
  public static forRoot(options: LoggerModuleOptions): DynamicModule {
    // FIXME: Убрать после отладки
    console.log(WinstonModule);

    const provider = createLoggerProvider();
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
      providers: [provider],
      exports: [provider],
    };
  }

  private static getTransports(transportOptions: TransportOption[]) {
    return transportOptions.reduce(
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
  }
}
