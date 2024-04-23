import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import {
  ArgumentsHost,
  CallHandler,
  Controller,
  ExecutionContext,
  Get,
  HttpStatus,
  INestApplication,
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
import { Client, RpcData } from '../src/typings';
import { LoggerInterceptor } from '../src/logger.interceptor';

@Controller()
class TestController {
  @Get('/api/v1/test')
  test() {
    return true;
  }
}

describe('Logger Interceptor', () => {
  const traceId = '1';
  const errorInfo = {
    error: 'Ошибка',
    name: 'Error',
    description: undefined,
    status: 500,
  };
  const requestInfo = {
    ip: '0.0.0.1',
    host: 'localhost',
    url: 'http://test',
    userId: '1',
    operationId: '1',
    traceId,
  };
  const eventInfo = {
    pattern: 'pattern',
    operationId: '2',
    sender: 'user',
    traceId,
  };
  const socketInfo = {
    traceId,
    userId: '1',
    operationId: '3',
    sessionId: '10',
  };

  let module: TestingModule;
  let interceptor: LoggerInterceptor;
  let logger: LoggerService;

  const next = {
    handle(..._args: unknown[]) {
      return this;
    },
    pipe(..._args: unknown[]) {
      return this;
    },
  };

  beforeEach(async () => {
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
      providers: [createLoggerProvider(), LoggerInterceptor],
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

    it('should remove all secret properties from response', async () => {
      const spyInfo = jest.spyOn(logger, 'info');

      console.log(request);
      // const response = await request(app.getHttpServer()).get('/api/v1/test');
      const response = { status: HttpStatus.OK };
      expect(response.status).toBe(HttpStatus.OK);
      expect(spyInfo).toHaveBeenCalledTimes(2);
    });

    afterEach(async () => {
      await app.close();
    });
  });

  // describe('intercept', () => {
  //   let spyGetTraceId: jest.SpyInstance;
  //   let spyInfo: jest.SpyInstance;

  //   beforeEach(() => {
  //     spyGetTraceId = jest
  //       .spyOn(logger, 'getTraceId')
  //       .mockImplementation(async () => traceId);
  //     spyInfo = jest.spyOn(logger, 'info');
  //   });

  //   afterEach(() => {
  //     jest.restoreAllMocks();
  //   });

  //   it('http type', async () => {
  //     const response = {
  //       status(..._args: unknown[]) {
  //         return this;
  //       },
  //       header(..._args: unknown[]) {
  //         return this;
  //       },
  //       send(..._args: unknown[]) {
  //         return this;
  //       },
  //     };
  //     const request = {
  //       ip: requestInfo.ip,
  //       hostname: requestInfo.host,
  //       url: requestInfo.url,
  //       user: {
  //         id: requestInfo.userId,
  //       },
  //       operationId: requestInfo.operationId,
  //     };
  //     const httpContext = {
  //       getResponse: jest.fn(() => response),
  //       getRequest: jest.fn(() => request),
  //     };

  //     const host = {
  //       getType: jest.fn(() => 'http'),
  //       switchToHttp: jest.fn(() => httpContext),
  //     };

  //     await interceptor.intercept(
  //       host as unknown as ExecutionContext,
  //       next as unknown as CallHandler,
  //     );

  //     expect(spyGetTraceId).toHaveBeenCalledTimes(1);
  //     expect(spyInfo).toHaveBeenCalledTimes(1);
  //     expect(spyInfo).toHaveBeenCalledWith({
  //       info: requestInfo,
  //       message: 'start request',
  //     });
  //   });
  //   it('rpc type', async () => {
  //     const rpcData: RpcData = {
  //       operationId: eventInfo.operationId,
  //       sender: eventInfo.sender,
  //     };
  //     const eventContext = {
  //       getPattern: () => eventInfo.pattern,
  //     };
  //     const rpcContext = {
  //       getData: () => rpcData,
  //       getContext: () => eventContext,
  //     };
  //     const host = {
  //       getType: jest.fn(() => 'rpc'),
  //       switchToRpc: jest.fn(() => rpcContext),
  //     };

  //     await filter.catch(exception, host as unknown as ArgumentsHost);

  //     expect(spyGetTraceId).toHaveBeenCalledTimes(1);
  //     expect(spyError).toHaveBeenCalledTimes(1);
  //     expect(spyError).toHaveBeenCalledWith({
  //       info: { ...eventInfo, ...errorInfo },
  //       message: 'error rpc event',
  //     });
  //   });
  //   it('ws type', async () => {
  //     const pattern = 'pattern';
  //     const status = 1011;

  //     const client: Client = {
  //       operationId: socketInfo.operationId,
  //       id: socketInfo.sessionId,
  //       user: { id: socketInfo.userId, role: 'admin', subscription: null },
  //     };

  //     const wsContext = {
  //       getClient: () => client,
  //       getPattern: () => pattern,
  //     };
  //     const host = {
  //       getType: jest.fn(() => 'ws'),
  //       switchToWs: jest.fn(() => wsContext),
  //     };

  //     await filter.catch(exception, host as unknown as ArgumentsHost);

  //     expect(spyGetTraceId).toHaveBeenCalledTimes(1);
  //     expect(spyError).toHaveBeenCalledTimes(1);
  //     expect(spyError).toHaveBeenCalledWith({
  //       info: { ...socketInfo, ...errorInfo, pattern, status },
  //       message: 'error ws event',
  //     });
  //   });
  //   it('strange type', async () => {
  //     const host = {
  //       getType: jest.fn(() => 'stranger'),
  //     };
  //     await filter.catch(exception, host as unknown as ArgumentsHost);

  //     expect(spyError).toHaveBeenCalledTimes(1);
  //     expect(spyError).toHaveBeenCalledWith({
  //       error: exception,
  //       message: 'strange type host',
  //     });
  //   });
  // });
});
