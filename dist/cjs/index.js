"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MobileBridge_1 = require("./MobileBridge");
const constant_1 = require("./constant");
const api_1 = require("./api");
console.log('=========MobileBridge=========', MobileBridge_1.default);
// 绑定到全局
window[constant_1.SDK_NAME] = MobileBridge_1.default;
window[constant_1.TEST_API_KEY] = api_1.default;
exports.default = MobileBridge_1.default;
