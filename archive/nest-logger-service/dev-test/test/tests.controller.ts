import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TestsService } from './tests.service';

@ApiTags('Тест')
@Controller('test')
export class TestsContoller {
  constructor(private readonly testsService: TestsService) {}

  @Get('/success')
  success() {
    return this.testsService.success();
  }

  @Get('/error')
  error() {
    return this.testsService.error();
  }
}
