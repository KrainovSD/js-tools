import type { FastifyBaseLogger, FastifyError, FastifyReply, FastifyRequest } from "fastify";

export type LoggerServiceConstructorOptions = {
  logger: FastifyBaseLogger;
};

export type LoggerExecuteOptions = {
  start?: boolean;
  stop?: boolean;
  error?: boolean;
};

type LoggerInfo = {
  loggerInfo?: Record<string, unknown>;
};

export type LoggerLayerOptions<T> = {
  action: () => Promise<T>;
  processData?: (data: unknown) => Promise<T>;
  loggerExecute?: LoggerExecuteOptions | boolean;
  loggerMessage?: string;
} & LoggerInfo;

type LoggerDefaultOptions = {
  info?: Record<string, unknown>;
  message?: string;
};
export type LoggerInfoOptions = LoggerDefaultOptions;
export type LoggerWarnOptions = { error?: unknown } & LoggerDefaultOptions;
export type LoggerErrorOptions = { error?: unknown } & LoggerDefaultOptions;

export type TransportFormat = "logfmt" | "json";
export type TransportSettings = {
  deniedProperties?: string[];
  format?: TransportFormat;
};

export type DefineMiddlewareSettings = {
  onError?: (error: FastifyError, request: FastifyRequest, reply: FastifyReply) => void;
  onRequest?: (request: FastifyRequest, reply: FastifyReply) => void;
  onSend?: (request: FastifyRequest, reply: FastifyReply, payload: unknown) => Promise<void>;
  onResponse?: (request: FastifyRequest, reply: FastifyReply) => void;
};
