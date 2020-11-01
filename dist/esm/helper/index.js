export function isNotify(message) {
    return true;
}
export function isRequest(msgObj) {
    const requestKeys = ['jsonrpc', 'id', 'method', 'params'];
    // 检查是否符合所有的 IRequest Key
    return requestKeys.every((requestKey) => {
        return msgObj.hasOwnProperty(requestKey);
    });
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
