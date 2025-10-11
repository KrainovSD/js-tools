import { Global, Module } from '@nestjs/common';

import { ConfigService } from './Config.service';

@Global()
@Module({
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
