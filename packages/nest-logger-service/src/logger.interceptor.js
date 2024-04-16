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
exports.LoggerInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const logger_service_1 = require("./logger.service");
const logger_constants_1 = require("./logger.constants");
let LoggerInterceptor = exports.LoggerInterceptor = class LoggerInterceptor {
    constructor(loggerService) {
        this.loggerService = loggerService;
    }
    async intercept(context, next) {
        const type = context.getType();
        switch (type) {
            case 'rpc': {
                return this.interceptRpc(context, next);
            }
            case 'http': {
                return await this.interceptHttp(context, next);
            }
            case 'ws': {
                return this.interceptWs(context, next);
            }
            default: {
                return next.handle();
            }
        }
    }
    async interceptHttp(context, next) {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest();
        const response = ctx.getResponse();
        const requestInfo = await this.loggerService.getRequestInfo(request);
        if (!request.operationId)
            request.operationId = requestInfo.operationId;
        this.loggerService.info({ info: requestInfo, message: 'start request' });
        return next.handle().pipe((0, operators_1.tap)(() => {
            this.loggerService.info({
                info: { ...requestInfo, status: response.statusCode },
                message: 'start request',
            });
        }));
    }
    interceptRpc(context, next) {
        const ctx = context.switchToRpc();
        const data = ctx.getData();
        const rpcContext = ctx.getContext();
        const eventInfo = {
            pattern: typeof rpcContext?.getPattern === 'function'
                ? rpcContext?.getPattern?.()
                : undefined,
            operationId: data?.operationId,
            sendBy: data?.sendBy,
        };
        this.loggerService.info({ info: eventInfo, message: 'start rpc event' });
        return next.handle().pipe((0, operators_1.tap)(() => {
            const channel = typeof rpcContext?.getChannelRef === 'function'
                ? rpcContext?.getChannelRef()
                : undefined;
            const originalMsg = typeof rpcContext?.getMessage === 'function'
                ? rpcContext?.getMessage()
                : undefined;
            channel?.ack?.(originalMsg);
            this.loggerService.info({ info: eventInfo, message: 'end rpc event' });
        }));
    }
    interceptWs(context, next) {
        const ctx = context.switchToWs();
        const client = ctx.getClient();
        const pattern = ctx.getPattern();
        const body = JSON.stringify(ctx.getData());
        const socketInfo = this.loggerService.getSocketInfo(client);
        if (!client.operationId)
            client.traceId = socketInfo.operationId;
        this.loggerService.info({
            info: { ...socketInfo, pattern },
            message: 'start socket event',
        });
        return next.handle().pipe((0, operators_1.tap)(() => {
            this.loggerService.info({
                info: { ...socketInfo, pattern },
                message: 'end socket event',
            });
            client.operationId = undefined;
        }));
    }
};
exports.LoggerInterceptor = LoggerInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(logger_constants_1.LOGGER_PROVIDER_MODULE)),
    __metadata("design:paramtypes", [logger_service_1.LoggerService])
], LoggerInterceptor);
//# sourceMappingURL=logger.interceptor.js.map