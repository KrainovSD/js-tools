import { Test, TestingModule } from '@nestjs/testing';
import { ArgumentsHost } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { transports } from 'winston';
import { LoggerFilter } from './logger.filter';
import { transportFormatLogfmt } from './helpers';
import { LoggerService } from './logger.service';
import { LOGGER_PROVIDER_MODULE } from './logger.constants';
import { createLoggerProvider } from './logger.provider';

describe('Logger Filter', () => {
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
    userId: 0,
    operationId: 1,
    traceId: '10',
  };

  let filter: LoggerFilter;
  let logger: LoggerService;

  beforeEach(async () => {
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
      providers: [createLoggerProvider(), LoggerFilter],
    }).compile();
    filter = module.get<LoggerFilter>(LoggerFilter);
    logger = module.get<LoggerService>(LOGGER_PROVIDER_MODULE);
  });

  it('filter should be defined', () => {
    expect(filter).toBeDefined();
  });
  it('logger should be defined', () => {
    expect(logger).toBeDefined();
  });

  describe('catch', () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('http type', async () => {
      const spyGetTraceId = jest
        .spyOn(logger, 'getTraceId')
        .mockImplementation(async () => requestInfo.traceId);
      const spyError = jest.spyOn(logger, 'error');

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

      const exception = {
        message: errorInfo.error,
        status: errorInfo.status,
        name: errorInfo.name,
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
  });
});
