import { Controller, Post, UseInterceptors } from '@nestjs/common';
import { UploadInterceptor } from '../../src';

@Controller()
@UseInterceptors(
  UploadInterceptor({
    fieldName: 'image',
    limits: 730 * 1024,
    mimeTypes: /\/(png|jpeg|jpg|gif)$/,
  }),
)
export class TestController {
  @Post('/api/v1/test')
  success() {
    return true;
  }
}
