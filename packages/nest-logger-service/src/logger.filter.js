"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerFilter = void 0;
const websockets_1 = require("@nestjs/websockets");
const utils_1 = require("@krainovsd/utils");
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const logger_constants_1 = require("./logger.constants");
const logger_service_1 = require("./logger.service");
let LoggerFilter = exports.LoggerFilter = class LoggerFilter {
    constructor(loggerService) {
        this.loggerService = loggerService;
    }
    catch(exception, host) {
        const type = host.getType();
        switch (type) {
            case 'rpc': {
                return this.rpcFilter(exception, host);
            }
            case 'http': {
                return this.httpFilter(exception, host);
            }
            case 'ws': {
                return this.wsFilter(exception, host);
            }
            default: {
                return this.loggerService.error({
                    message: 'strange type host',
                    error: exception,
                });
            }
        }
    }
    async httpFilter(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const requestInfo = await this.loggerService.getRequestInfo(request);
        const errorInfo = this.loggerService.getErrorInfo(exception);
        const status = errorInfo.status || 500;
        this.loggerService.error({
            info: { ...requestInfo, ...errorInfo, status },
            message: 'request error',
        });
        if (requestInfo.traceId) {
            response.header('traceId', requestInfo.traceId);
        }
        return response
            .status(status)
            .header('operationId', request.operationId)
            .send({
            statusCode: status,
            timestamp: new Date().toISOString(),
            traceId: requestInfo.traceId,
            operationId: requestInfo.operationId,
            path: request.url,
            message: errorInfo.error,
            description: errorInfo.description,
        });
    }
    rpcFilter(exception, host) {
        const ctx = host.switchToRpc();
        const data = ctx.getData();
        const rpcContext = ctx.getContext();
        const errorInfo = this.loggerService.getErrorInfo(exception);
        const eventInfo = {
            pattern: typeof rpcContext?.getPattern === 'function'
                ? rpcContext?.getPattern?.()
                : undefined,
            operationId: data?.operationId,
            sendBy: data?.sendBy,
        };
        this.loggerService.error({
            info: { ...eventInfo, ...errorInfo },
            message: 'error rpc event',
        });
        return (0, rxjs_1.throwError)(() => ({ status: 'error', message: errorInfo.error }));
    }
    wsFilter(exception, host) {
        const ctx = host.switchToWs();
        const client = ctx.getClient();
        const pattern = ctx.getPattern();
        const body = JSON.stringify(ctx.getData());
        const socketInfo = this.loggerService.getSocketInfo(client);
        const errorInfo = this.loggerService.getErrorInfo(exception);
        const status = !errorInfo.status ||
            errorInfo.status === common_1.HttpStatus.INTERNAL_SERVER_ERROR ||
            errorInfo.status < 1000
            ? 1011
            : errorInfo.status;
        const reason = JSON.stringify({
            name: errorInfo.error,
            description: errorInfo.description,
            operationId: socketInfo.operationId,
        });
        this.loggerService.error({
            info: {
                ...socketInfo,
                pattern: !utils_1.typings.isString(pattern) ? JSON.stringify(pattern) : pattern,
                ...errorInfo,
                status,
            },
            message: 'error ws event',
        });
        if (typeof client.close === 'function')
            client.close(status, reason);
        if (websockets_1.WsException)
            return new websockets_1.WsException(reason);
        return null;
    }
};
exports.LoggerFilter = LoggerFilter = __decorate([
    (0, common_1.Catch)(),
    __param(0, (0, common_1.Inject)(logger_constants_1.LOGGER_PROVIDER_MODULE)),
    __metadata("design:paramtypes", [logger_service_1.LoggerService])
], LoggerFilter);
//# sourceMappingURL=logger.filter.js.map