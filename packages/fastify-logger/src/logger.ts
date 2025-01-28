import { isBoolean, isObject } from "@krainovsd/js-helpers";
import type { FastifyBaseLogger } from "fastify";
import { getErrorInfo } from "./lib";
import type {
  LoggerErrorOptions,
  LoggerExecuteOptions,
  LoggerInfoOptions,
  LoggerLayerOptions,
  LoggerServiceConstructorOptions,
  LoggerWarnOptions,
} from "./logger-types";

export class Logger {
  private logger: FastifyBaseLogger;

  constructor({ logger }: LoggerServiceConstructorOptions) {
    this.logger = logger;
  }

  async loggerLayer<T>({
    action,
    processData,
    loggerExecute,
    loggerMessage,
    loggerInfo,
  }: LoggerLayerOptions<T>) {
    try {
      if (this.isHasLoggerAction(loggerExecute, "start"))
        this.debug({ info: loggerInfo, message: `start ${loggerMessage}` });

      const data = await action();
      const processingData = processData ? await processData(data) : data;

      if (this.isHasLoggerAction(loggerExecute, "stop"))
        this.debug({ info: loggerInfo, message: `stop ${loggerMessage}` });

      return processingData as T;
    } catch (error) {
      if (this.isHasLoggerAction(loggerExecute, "error"))
        this.warn({ info: loggerInfo, error, message: `error ${loggerMessage}` });

      throw error;
    }
  }

  debug({ info = {}, message = "debug" }: LoggerInfoOptions) {
    this.logger.debug(info, message);
  }

  info({ info = {}, message = "info" }: LoggerInfoOptions) {
    this.logger.info(info, message);
  }

  warn({ info = {}, message = "warn", error }: LoggerWarnOptions) {
    const errorInfo = getErrorInfo(error, false);
    this.logger.warn({ ...errorInfo, ...info }, message);
  }

  error({ error, info = {}, message = "error" }: LoggerErrorOptions) {
    const errorInfo = getErrorInfo(error);
    this.logger.error({ ...errorInfo, ...info }, message);
  }

  private isHasLoggerAction(
    options: LoggerExecuteOptions | boolean | undefined,
    action: keyof LoggerExecuteOptions,
  ) {
    if (isBoolean(options)) return options;
    if (isObject(options) && isBoolean(options[action])) return options[action];

    return true;
  }
}
