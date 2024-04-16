"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transportFormatJson = exports.transportFormatLogfmt = void 0;
const winston_1 = require("winston");
exports.transportFormatLogfmt = winston_1.format.printf((info) => {
    console.log(info);
    return getCorrectLog(info);
});
exports.transportFormatJson = winston_1.format.printf((info) => {
    console.log(info);
    return JSON.stringify(info);
});
function isHasSpace(str) {
    return typeof str === 'string' && str.includes(' ');
}
function getCorrectLog(obj, deniedProperties) {
    let log = '';
    for (let [key, value] of Object.entries(obj)) {
        if ((deniedProperties && deniedProperties.includes(key.toLowerCase())) ||
            typeof value === 'undefined')
            continue;
        if (isHasSpace(value)) {
            value = `"${value}"`;
        }
        log += `${key}=${value} `;
    }
    return log.trim();
}
//# sourceMappingURL=transport.js.map