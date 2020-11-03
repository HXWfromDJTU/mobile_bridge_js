"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IframeChannel = void 0;
class IframeChannel {
    postMessage(data) {
        window.parent.postMessage(data, '*'); // 不限制接收源
    }
}
exports.IframeChannel = IframeChannel;
