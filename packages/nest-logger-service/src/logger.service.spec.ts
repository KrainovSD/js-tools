import { Test, TestingModule } from '@nestjs/testing';
import { FastifyRequest } from 'fastify';
import { WINSTON_MODULE_PROVIDER, WinstonModule } from 'nest-winston';
import * as uuid from 'uuid';
import { Logger, transports } from 'winston';

import { transportFormatLogfmt } from './helpers';
import { loggerProvider } from './logger.provider';
import { LoggerService } from './logger.service';
import { LOGGER_TOKEN } from './logger.constants';
import { Client } from './typings';
import { LoggerModule } from './logger.module';
import { ConfigModule, ConfigService, config } from './helpers/config';

jest.mock('uuid');

describe('Logger Service', () => {
  describe('check is defined by all methods', () => {
    it('should be defined sync', async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [LoggerModule.forRoot(config)],
      }).compile();
      const service = module.get<LoggerService>(LOGGER_TOKEN);
      expect(service).toBeDefined();
    });

    it('should be defined async useFactory', async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [
          ConfigModule,
          LoggerModule.forRootAsync({
            useFactory: (moduleConfig: ConfigService) =>
              moduleConfig.createOptions(),
            inject: [ConfigService],
          }),
        ],
      }).compile();
      const service = module.get<LoggerService>(LOGGER_TOKEN);
      expect(service).toBeDefined();
    });

    it('should be defined async useExisting', async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [
          ConfigModule,
          LoggerModule.forRootAsync({
            useExisting: ConfigService,
          }),
        ],
      }).compile();
      const service = module.get<LoggerService>(LOGGER_TOKEN);
      expect(service).toBeDefined();
    });

    it('should be defined async useClass', async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [
          LoggerModule.forRootAsync({
            useClass: ConfigService,
          }),
        ],
      }).compile();
      const service = module.get<LoggerService>(LOGGER_TOKEN);
      expect(service).toBeDefined();
    });

    it('should be defined async empty', async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [LoggerModule.forRootAsync({})],
      }).compile();
      const service = module.get<LoggerService>(LOGGER_TOKEN);
      expect(service).toBeDefined();
    });
  });
  describe('check service', () => {
    let service: LoggerService;
    let logger: Logger;

    beforeAll(async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [
          WinstonModule.forRoot({
            transports: [
              new transports.Console({
                level: 'error',
                format: transportFormatLogfmt,
                handleExceptions: true,
                handleRejections: true,
              }),
            ],
            defaultMeta: { meta: 'test' },
          }),
        ],
        providers: [loggerProvider],
      }).compile();
      service = module.get<LoggerService>(LOGGER_TOKEN);
      logger = module.get<Logger>(WINSTON_MODULE_PROVIDER);
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    const traceId = 'traceId';
    const operationId = 'operationId';

    describe('getTraceId', () => {
      it('not error', async () => {
        await expect(service.getTraceId()).resolves.not.toBeNull();
      });
    });
    describe('getRequestInfo', () => {
      const request = {
        ip: '::1',
        hostname: 'localhost',
        url: '/api/v1',
        user: {
          id: '1',
        },
        operationId: '1',
      };

      it('with operation Id', async () => {
        jest
          .spyOn(service, 'getTraceId')
          .mockImplementation(async () => traceId);
        const requestInfo = await service.getRequestInfo(
          request as unknown as FastifyRequest,
        );
        expect(requestInfo).toEqual({
          ip: request.ip,
          host: request.hostname,
          url: request.url,
          userId: request.user.id,
          operationId: request.operationId,
          traceId,
        });
      });
      it('without operation Id', async () => {
        jest
          .spyOn(service, 'getTraceId')
          .mockImplementation(async () => traceId);
        jest.spyOn(uuid, 'v4').mockReturnValue(operationId);

        const requestInfo = await service.getRequestInfo({
          ...(request as unknown as FastifyRequest),
          operationId: undefined,
        });
        expect(requestInfo).toEqual({
          ip: request.ip,
          host: request.hostname,
          url: request.url,
          userId: request.user.id,
          operationId,
          traceId,
        });
      });
    });
    describe('getErrorInfo', () => {
      const error = {
        message: "it's error",
        messages: ['test'],
        name: 'error',
        status: 500,
      };
      const notValidError = {
        message: null,
        messages: 'test',
        name: 2,
        status: '500',
      };

      it('common error', () => {
        const errorInfo = service.getErrorInfo(error);
        expect(errorInfo).toEqual({
          error: error.message,
          name: error.name,
          description: JSON.stringify(error.messages),
          status: error.status,
        });
      });

      it('inner error', () => {
        const errorInfo = service.getErrorInfo({ error });
        expect(errorInfo).toEqual({
          error: error.message,
          name: error.name,
          description: JSON.stringify(error.messages),
          status: error.status,
        });
      });

      it('not valid error', () => {
        const errorInfo = service.getErrorInfo(null);
        expect(errorInfo).toEqual({
          error: undefined,
          name: undefined,
          description: undefined,
          status: undefined,
        });
      });
      it('not valid data error', () => {
        const errorInfo = service.getErrorInfo(notValidError);
        expect(errorInfo).toEqual({
          error: null,
          name: undefined,
          description: undefined,
          status: undefined,
        });
      });
    });
    describe('getSocketInfo', () => {
      const socket = {
        user: {
          id: '1',
        },
        operationId: '2',
        id: '3',
      };

      it('with operation id', async () => {
        jest
          .spyOn(service, 'getTraceId')
          .mockImplementation(async () => traceId);
        const socketInfo = await service.getSocketInfo(
          socket as unknown as Client,
        );
        expect(socketInfo).toEqual({
          traceId,
          userId: socket.user.id,
          operationId: socket.operationId,
          sessionId: socket.id,
        });
      });
      it('without operation Id', async () => {
        jest
          .spyOn(service, 'getTraceId')
          .mockImplementation(async () => traceId);
        jest.spyOn(uuid, 'v4').mockReturnValue(operationId);
        const socketInfo = await service.getSocketInfo({
          ...(socket as unknown as Client),
          operationId: undefined,
        });

        expect(socketInfo).toEqual({
          traceId,
          userId: socket.user.id,
          operationId,
          sessionId: socket.id,
        });
      });
    });
    describe('handle log', () => {
      const info = { info: '10' };
      const message = 'test';

      describe('debug', () => {
        it('empty info and error', () => {
          const spy = jest.spyOn(logger, 'debug');
          service.debug({ message });
          expect(spy).toHaveBeenLastCalledWith(message, {});
        });
        it('with info', () => {
          const spy = jest.spyOn(logger, 'debug');
          service.debug({ message, info });
          expect(spy).toHaveBeenLastCalledWith(message, { ...info });
        });
      });
      describe('info', () => {
        it('empty info', () => {
          const spy = jest.spyOn(logger, 'info');
          service.info({ message });
          expect(spy).toHaveBeenLastCalledWith(message, {});
        });
        it('with info', () => {
          const spy = jest.spyOn(logger, 'info');
          service.info({ message, info });
          expect(spy).toHaveBeenLastCalledWith(message, { ...info });
        });
      });
      describe('warn', () => {
        it('empty info and error', () => {
          const spy = jest.spyOn(logger, 'warn');
          service.warn({ message });
          expect(spy).toHaveBeenLastCalledWith(message, {});
        });
        it('with info', () => {
          const spy = jest.spyOn(logger, 'warn');
          service.warn({ message, info });
          expect(spy).toHaveBeenLastCalledWith(message, { ...info });
        });
      });
      describe('error', () => {
        it('empty info and error', () => {
          const spy = jest.spyOn(logger, 'error');
          service.error({ message });
          expect(spy).toHaveBeenLastCalledWith(message, {});
        });
        it('with info', () => {
          const spy = jest.spyOn(logger, 'error');
          service.error({ message, info });
          expect(spy).toHaveBeenLastCalledWith(message, { ...info });
        });
      });
    });
  });
});
