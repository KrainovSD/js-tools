import { FastifyRequest } from 'fastify';
import { Logger } from 'winston';
import { Client, DebugOptions, ErrorOptions, InfoOptions, WarnOptions } from './typings';
export declare class LoggerService {
    private readonly logger;
    constructor(logger: Logger);
    debug({ info, message, error }: DebugOptions): void;
    info({ info, message }: InfoOptions): void;
    warn({ info, message, error }: WarnOptions): void;
    error({ error, info, message }: ErrorOptions): void;
    getRequestInfo(request: FastifyRequest): Promise<{
        ip: string;
        host: string;
        url: string;
        userId: string;
        operationId: string;
        traceId: string | undefined;
    }>;
    getErrorInfo(err: unknown): {
        error: unknown;
        name: string | undefined;
        description: string | undefined;
        stack: string | undefined;
        status: number | undefined;
    };
    getSocketInfo(client: Client): {
        userId: string | undefined;
        operationId: string;
        sessionId: string | undefined;
    };
}
