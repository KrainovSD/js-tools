"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var LoggerModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerModule = void 0;
const nest_winston_1 = require("nest-winston");
const common_1 = require("@nestjs/common");
const winston_1 = require("winston");
const logger_provider_1 = require("./logger.provider");
const helpers_1 = require("./helpers");
const logger_constants_1 = require("./logger.constants");
let LoggerModule = exports.LoggerModule = LoggerModule_1 = class LoggerModule {
    static forRoot(options) {
        const providers = (0, logger_provider_1.createLoggerProvider)();
        const customTransports = options.transportOptions.reduce((result, option) => {
            let customFormat = helpers_1.transportFormatLogfmt;
            switch (option.format) {
                case logger_constants_1.TRANSPORT_FORMATS.json: {
                    customFormat = helpers_1.transportFormatJson;
                    break;
                }
                default: {
                    break;
                }
            }
            switch (option.type) {
                case logger_constants_1.TRANSPORT_TYPES.console: {
                    result.push(new winston_1.transports.Console({
                        level: option.level,
                        format: customFormat,
                        handleExceptions: true,
                        handleRejections: true,
                    }));
                    return result;
                }
                case logger_constants_1.TRANSPORT_TYPES.file: {
                    result.push(new winston_1.transports.File({
                        dirname: option.dirName,
                        filename: option.fileName,
                        level: option.level,
                        format: customFormat,
                        handleExceptions: true,
                        handleRejections: true,
                    }));
                    return result;
                }
                default: {
                    return result;
                }
            }
        }, []);
        return {
            module: LoggerModule_1,
            imports: [
                nest_winston_1.WinstonModule.forRoot({
                    transports: customTransports,
                    defaultMeta: options.defaultMeta,
                }),
            ],
            controllers: [],
            providers: [providers],
            exports: [providers],
        };
    }
};
exports.LoggerModule = LoggerModule = LoggerModule_1 = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({})
], LoggerModule);
//# sourceMappingURL=logger.module.js.map