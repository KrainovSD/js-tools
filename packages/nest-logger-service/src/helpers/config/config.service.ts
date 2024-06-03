import { Injectable } from '@nestjs/common';
import {
  LoggerModuleOptions,
  LoggerOptionFactory,
} from '../../logger.interfaces';
import { config } from './config.constants';

@Injectable()
export class ConfigService implements LoggerOptionFactory {
  createOptions(): LoggerModuleOptions | Promise<LoggerModuleOptions> {
    return config;
  }
}
