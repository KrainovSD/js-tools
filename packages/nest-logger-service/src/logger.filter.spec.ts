import { Test, TestingModule } from '@nestjs/testing';
import { ArgumentsHost } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { transports } from 'winston';

import { LoggerFilter } from './logger.filter';
import { transportFormatLogfmt } from './helpers';
import { LoggerService } from './logger.service';
import { loggerProvider } from './logger.provider';
import { Client } from './typings';
import { LOGGER_TOKEN } from './logger.constants';

describe('Logger Filter', () => {
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
    traceId,
  };
  const socketInfo = {
    traceId,
    userId: '1',
    operationId: '3',
    sessionId: '10',
  };
  const exception = {
    message: errorInfo.error,
    status: errorInfo.status,
    name: errorInfo.name,
  };

  let filter: LoggerFilter;
  let logger: LoggerService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
      providers: [loggerProvider, LoggerFilter],
    }).compile();
    filter = module.get<LoggerFilter>(LoggerFilter);
    logger = module.get<LoggerService>(LOGGER_TOKEN);
  });

  it('filter should be defined', () => {
    expect(filter).toBeDefined();
  });
  it('logger should be defined', () => {
    expect(logger).toBeDefined();
  });

  describe('catch', () => {
    let spyGetTraceId: jest.SpyInstance;
    let spyError: jest.SpyInstance;

    beforeEach(() => {
      spyGetTraceId = jest
        .spyOn(logger, 'getTraceId')
        .mockImplementation(async () => traceId);
      spyError = jest.spyOn(logger, 'error');
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('http type', async () => {
      const response = {
        status(..._args: unknown[]) {
          return this;
        },
        header(..._args: unknown[]) {
          return this;
        },
        send(..._args: unknown[]) {
          return this;
        },
      };
      const request = {
        ip: requestInfo.ip,
        hostname: requestInfo.host,
        url: requestInfo.url,
        user: {
          id: requestInfo.userId,
        },
        operationId: requestInfo.operationId,
      };
      const httpContext = {
        getResponse: jest.fn(() => response),
        getRequest: jest.fn(() => request),
      };
      const spyHeader = jest.spyOn(response, 'header');

      const host = {
        getType: jest.fn(() => 'http'),
        switchToHttp: jest.fn(() => httpContext),
      };

      await filter.catch(exception, host as unknown as ArgumentsHost);

      expect(spyGetTraceId).toHaveBeenCalledTimes(1);
      expect(spyError).toHaveBeenCalledTimes(1);
      expect(spyHeader).toHaveBeenCalledTimes(2);
      expect(spyError).toHaveBeenCalledWith({
        info: { ...requestInfo, ...errorInfo, status: errorInfo.status },
        message: 'request error',
      });
    });
    it('rpc type', async () => {
      const rpcData = {
        test: 2,
      };
      const eventContext = {
        getPattern: () => eventInfo.pattern,
      };
      const rpcContext = {
        getData: () => rpcData,
        getContext: () => eventContext,
      };
      const host = {
        getType: jest.fn(() => 'rpc'),
        switchToRpc: jest.fn(() => rpcContext),
      };

      await filter.catch(exception, host as unknown as ArgumentsHost);

      expect(spyGetTraceId).toHaveBeenCalledTimes(1);
      expect(spyError).toHaveBeenCalledTimes(1);
      expect(spyError).toHaveBeenCalledWith({
        info: { ...eventInfo, ...errorInfo },
        message: 'error rpc event',
      });
    });
    it('ws type', async () => {
      const pattern = 'pattern';
      const status = 1011;

      const client: Client = {
        operationId: socketInfo.operationId,
        id: socketInfo.sessionId,
        user: { id: socketInfo.userId, role: 'admin', subscription: null },
      };

      const wsContext = {
        getClient: () => client,
        getPattern: () => pattern,
      };
      const host = {
        getType: jest.fn(() => 'ws'),
        switchToWs: jest.fn(() => wsContext),
      };

      await filter.catch(exception, host as unknown as ArgumentsHost);

      expect(spyGetTraceId).toHaveBeenCalledTimes(1);
      expect(spyError).toHaveBeenCalledTimes(1);
      expect(spyError).toHaveBeenCalledWith({
        info: { ...socketInfo, ...errorInfo, pattern, status },
        message: 'error ws event',
      });
    });
    it('strange type', async () => {
      const host = {
        getType: jest.fn(() => 'stranger'),
      };
      await filter.catch(exception, host as unknown as ArgumentsHost);

      expect(spyError).toHaveBeenCalledTimes(1);
      expect(spyError).toHaveBeenCalledWith({
        error: exception,
        message: 'strange type host',
      });
    });
  });
});
