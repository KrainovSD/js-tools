import { Injectable } from '@nestjs/common';

import { JwtModuleOptions, JwtOptionFactory } from '../../jwt.interfaces';
import { moduleConfig } from './Config.constants';

@Injectable()
export class ConfigService implements JwtOptionFactory {
  createOptions(): JwtModuleOptions | Promise<JwtModuleOptions> {
    return moduleConfig;
  }
}
