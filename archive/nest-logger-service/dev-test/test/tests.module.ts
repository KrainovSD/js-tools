import { Module } from '@nestjs/common';
import { TestsContoller } from './tests.controller';
import { TestsService } from './tests.service';

@Module({
  controllers: [TestsContoller],
  providers: [TestsService],
  exports: [TestsService],
})
export class TestsModule {}
