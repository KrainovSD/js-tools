import { Injectable } from '@nestjs/common';
import { S3ModuleOptions, S3OptionsFactory } from '../s3';
import { s3Config } from './s3Config.constants';

@Injectable()
export class S3ConfigService implements S3OptionsFactory {
  createOptions(): S3ModuleOptions | Promise<S3ModuleOptions> {
    return s3Config;
  }
}
