"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLoggerProvider = void 0;
const logger_constants_1 = require("./logger.constants");
const logger_service_1 = require("./logger.service");
function createLoggerProvider() {
    return {
        provide: logger_constants_1.LOGGER_PROVIDER_MODULE,
        useClass: logger_service_1.LoggerService,
    };
}
exports.createLoggerProvider = createLoggerProvider;
//# sourceMappingURL=logger.provider.js.map