import { Global, Module } from '@nestjs/common';
import { S3ConfigService } from './s3Config.service';

@Global()
@Module({
  providers: [S3ConfigService],
  exports: [S3ConfigService],
})
export class S3ConfigModule {}
