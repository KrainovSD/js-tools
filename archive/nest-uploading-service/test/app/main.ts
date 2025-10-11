import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import multipart from '@fastify/multipart';

import { TestModule } from './test.module';

export async function createApp() {
  const app = await NestFactory.create<NestFastifyApplication>(
    TestModule,
    new FastifyAdapter(),
  );

  app.register(multipart, {
    throwFileSizeLimit: true,
  });

  return app;
}
