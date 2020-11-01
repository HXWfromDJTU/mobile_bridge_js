"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isIframeEnv = exports.isResponse = exports.isRequest = exports.isNotify = void 0;
function isNotify(message) {
    return true;
}
exports.isNotify = isNotify;
function isRequest(msgObj) {
    const requestKeys = ['jsonrpc', 'id', 'method', 'params'];
    // 检查是否符合所有的 IRequest Key
    return requestKeys.every((requestKey) => {
        return msgObj.hasOwnProperty(requestKey);
    });
}
exports.isRequest = isRequest;
function isResponse(msgObj) {
    const responseKeys = ['jsonrpc', 'id', 'errCode'];
    // 检查是否符合所有的 IRequest Key
    return responseKeys.every((requestKey) => {
        return msgObj.hasOwnProperty(requestKey);
    });
}
exports.isResponse = isResponse;
function isIframeEnv() {
    return window.self !== window.top;
}
exports.isIframeEnv = isIframeEnv;
