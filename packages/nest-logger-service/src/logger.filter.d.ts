import { WsException } from '@nestjs/websockets';
import { ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { LoggerService } from './logger.service';
export declare class LoggerFilter implements ExceptionFilter {
    private readonly loggerService;
    constructor(loggerService: LoggerService);
    catch(exception: unknown, host: ArgumentsHost): void | import("rxjs").Observable<never> | WsException | Promise<never> | null;
    httpFilter(exception: unknown, host: ArgumentsHost): Promise<never>;
    rpcFilter(exception: unknown, host: ArgumentsHost): import("rxjs").Observable<never>;
    wsFilter(exception: unknown, host: ArgumentsHost): WsException | null;
}
