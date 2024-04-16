import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { LoggerService } from './logger.service';
export declare class LoggerInterceptor implements NestInterceptor {
    private readonly loggerService;
    constructor(loggerService: LoggerService);
    intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<unknown>>;
    interceptHttp(context: ExecutionContext, next: CallHandler): Promise<Observable<any>>;
    interceptRpc(context: ExecutionContext, next: CallHandler): Observable<any>;
    interceptWs(context: ExecutionContext, next: CallHandler): Observable<any>;
}
