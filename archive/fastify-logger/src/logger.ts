import { ResponseError, isBoolean, isObject } from "@krainovsd/js-helpers";
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
    loggerExecute = { error: true, start: false, stop: false },
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

  async controllerLayer<T = unknown>(
    action: () => Promise<T>,
    logger: boolean = true,
  ): Promise<
    | { data: T; status: 200; success: true }
    | { data: { message: string }; status: number; success: false }
  > {
    try {
      const result = await action();

      return {
        data: result,
        status: 200,
        success: true,
      };
    } catch (error) {
      if (logger) this.error({ error });

      if (error instanceof ResponseError) {
        return { data: { message: error.message }, status: error.status, success: false };
      }

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
    if (isObject(options)) return Boolean(options[action]);

    return false;
  }
}
