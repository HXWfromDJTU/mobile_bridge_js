"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUserAgent = exports.isIframeEnv = exports.isResponse = exports.isNotify = exports.isRequest = void 0;
const constant_1 = require("../constant");
function isRequest(msgObj) {
    const requestKeys = ['jsonrpc', 'id', 'method', 'params'];
    // 检查是否符合所有的 IRequest Key
    return requestKeys.every((requestKey) => {
        return msgObj.hasOwnProperty(requestKey);
    });
}
exports.isRequest = isRequest;
function isNotify(msgObj) {
    const notifyKeys = ['jsonrpc', 'id', 'data'];
    // 检查是否符合所有的 IRequest Key
    const allKeys = notifyKeys.every((requestKey) => {
        return msgObj.hasOwnProperty(requestKey);
    });
    return allKeys && msgObj.id === constant_1.NOTIFY_PREFIX;
}
exports.isNotify = isNotify;
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
/**
 * 获取当前平台以及应用信息
 */
function getAllUserAgent() {
    const ua = window.navigator.userAgent.toLowerCase();
    return {
        // 平台UA
        android: ua.includes('android'),
        ios: ua.includes('iphone') || ua.includes('ipad'),
        windows: ua.includes('windows'),
        ubuntu: ua.includes('ubuntu'),
        mac: ua.includes('mac'),
    };
}
exports.getAllUserAgent = getAllUserAgent;
