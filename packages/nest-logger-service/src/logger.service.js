"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerService = void 0;
const utils_1 = require("@krainovsd/utils");
const uuid_1 = require("uuid");
const nest_winston_1 = require("nest-winston");
const api_1 = require("@opentelemetry/api");
const common_1 = require("@nestjs/common");
const winston_1 = require("winston");
let LoggerService = exports.LoggerService = class LoggerService {
    constructor(logger) {
        this.logger = logger;
    }
    debug({ info = {}, message = 'debug', error }) {
        const errorInfo = error ? this.getErrorInfo(error) : {};
        this.logger.debug(message, { ...info, ...errorInfo });
    }
    info({ info = {}, message = 'info' }) {
        this.logger.info(message, info);
    }
    warn({ info = {}, message = 'warn', error }) {
        const errorInfo = error ? this.getErrorInfo(error) : {};
        this.logger.warn(message, { ...info, ...errorInfo });
    }
    error({ error, info = {}, message = 'error' }) {
        const errorInfo = error ? this.getErrorInfo(error) : {};
        this.logger.error(message, { ...info, ...errorInfo });
    }
    async getRequestInfo(request) {
        console.log(api_1.trace);
        let traceId;
        try {
            const { trace } = await Promise.resolve().then(() => __importStar(require('@opentelemetry/api')));
            if (trace) {
                traceId = trace?.getActiveSpan()?.spanContext()?.traceId ?? undefined;
            }
        }
        catch {
        }
        const ip = request.ip;
        const host = request.hostname;
        const url = request.url;
        const userId = request.user?.id;
        const operationId = request.operationId ?? (0, uuid_1.v4)();
        return { ip, host, url, userId, operationId, traceId };
    }
    getErrorInfo(err) {
        if (utils_1.typings.isObject(err) && utils_1.typings.isObject(err?.error)) {
            err = err.error;
        }
        const error = utils_1.typings.isObject(err) ? err?.message : undefined;
        const description = utils_1.typings.isObject(err) && utils_1.typings.isObject(err?.messages)
            ? JSON.stringify(err.messages)
            : undefined;
        const name = utils_1.typings.isObject(err) && utils_1.typings.isString(err?.name)
            ? err?.name
            : undefined;
        const stack = utils_1.typings.isObject(err) && utils_1.typings.isString(err?.stack)
            ? err?.stack
            : undefined;
        const status = utils_1.typings.isObject(err) && utils_1.typings.isNumber(err?.status)
            ? err.status
            : undefined;
        return { error, name, description, stack, status };
    }
    getSocketInfo(client) {
        return {
            userId: client.user?.id,
            operationId: client.operationId ?? (0, uuid_1.v4)(),
            sessionId: client.id,
        };
    }
};
exports.LoggerService = LoggerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(nest_winston_1.WINSTON_MODULE_PROVIDER)),
    __metadata("design:paramtypes", [winston_1.Logger])
], LoggerService);
//# sourceMappingURL=logger.service.js.map