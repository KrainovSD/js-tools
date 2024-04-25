import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import {
  Controller,
  Get,
  HttpStatus,
  INestApplication,
  UseInterceptors,
} from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

import { WinstonModule } from 'nest-winston';
import { transports } from 'winston';
import { transportFormatLogfmt } from '../src/helpers';
import { LoggerService } from '../src/logger.service';
import { LOGGER_PROVIDER_MODULE } from '../src/logger.constants';
import { createLoggerProvider } from '../src/logger.provider';
import { LoggerInterceptor } from '../src/logger.interceptor';

@Controller()
@UseInterceptors(LoggerInterceptor)
class TestController {
  @Get('/api/v1/test/success')
  success() {
    return true;
  }

  @Get('/api/v1/test/error')
  error() {
    throw new Error();
  }
}

describe('Logger Interceptor', () => {
  let module: TestingModule;
  let interceptor: LoggerInterceptor;
  let logger: LoggerService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        WinstonModule.forRoot({
          transports: [
            new transports.Console({
              level: 'info',
              format: transportFormatLogfmt,
              handleExceptions: true,
              handleRejections: true,
            }),
          ],
          defaultMeta: { meta: 'test' },
        }),
      ],
      controllers: [TestController],
      providers: [createLoggerProvider()],
    }).compile();
    interceptor = module.get<LoggerInterceptor>(LoggerInterceptor);
    logger = module.get<LoggerService>(LOGGER_PROVIDER_MODULE);
  });

  describe('check define', () => {
    it('interceptor should be defined', () => {
      expect(interceptor).toBeDefined();
    });
    it('logger should be defined', () => {
      expect(logger).toBeDefined();
    });
  });

  describe('check server', () => {
    let app: INestApplication;

    beforeEach(async () => {
      app = module.createNestApplication<NestFastifyApplication>(
        new FastifyAdapter(),
      );
      await app.init();
      await app.getHttpAdapter().getInstance().ready();
    });

    it('http success should call info logger 2 times', async () => {
      const spyInfo = jest.spyOn(logger, 'info');

      const response = await request(app.getHttpServer()).get(
        '/api/v1/test/success',
      );
      expect(response.status).toBe(HttpStatus.OK);
      expect(spyInfo).toHaveBeenCalledTimes(2);
    });
    it('http error should call info logger 1 times', async () => {
      const spyInfo = jest.spyOn(logger, 'info');

      const response = await request(app.getHttpServer()).get(
        '/api/v1/test/error',
      );
      expect(response.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(spyInfo).toHaveBeenCalledTimes(1);
    });

    afterEach(async () => {
      await app.close();
      jest.restoreAllMocks();
    });
  });
});
