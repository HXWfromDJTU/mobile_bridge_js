import { NOTIFY_PREFIX } from '../constant';
export function isRequest(msgObj) {
    const requestKeys = ['jsonrpc', 'id', 'method', 'params'];
    // 检查是否符合所有的 IRequest Key
    return requestKeys.every((requestKey) => {
        return msgObj.hasOwnProperty(requestKey);
    });
}
export function isNotify(msgObj) {
    const notifyKeys = ['jsonrpc', 'id', 'data'];
    // 检查是否符合所有的 IRequest Key
    const allKeys = notifyKeys.every((requestKey) => {
        return msgObj.hasOwnProperty(requestKey);
    });
    return allKeys && msgObj.id === NOTIFY_PREFIX;
}
export function isResponse(msgObj) {
    const responseKeys = ['jsonrpc', 'id', 'errCode'];
    // 检查是否符合所有的 IRequest Key
    return responseKeys.every((requestKey) => {
        return msgObj.hasOwnProperty(requestKey);
    });
}
export function isIframeEnv() {
    return window.self !== window.top;
}
/**
 * 获取当前平台以及应用信息
 */
export function getAllUserAgent() {
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
