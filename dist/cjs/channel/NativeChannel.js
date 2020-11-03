"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NativeChannel = void 0;
const helper_1 = require("../helper");
const constant_1 = require("../constant");
class NativeChannel {
    /**
     *
     * @param useChannelName 当前用于通信的信道对象，在window上的key值
     * @param logger
     */
    constructor(useChannelName, logger) {
        this.isIOS = false;
        this.isAndroid = false;
        const UAInfo = helper_1.getAllUserAgent();
        this.logger = logger;
        this.useChannelName = useChannelName;
        this.isIOS = UAInfo.ios;
        this.isAndroid = UAInfo.android;
    }
    postMessage(data) {
        var _a, _b, _c;
        this.logger.debug(`${constant_1.SDK_NAME}-NativeChannel send message`, data);
        if (this.isAndroid) {
            this.logger.debug(`${constant_1.SDK_NAME}-NativeChannel Android send message`, data);
            const bridge = window[this.useChannelName];
            if (bridge && bridge.postMessage) {
                bridge.postMessage(data);
            }
            else {
                this.logger.error(`${constant_1.SDK_NAME}-NativeChannel Android: bridge not found in window, name =`, this.useChannelName);
            }
        }
        else if (this.isIOS) {
            this.logger.debug(`${constant_1.SDK_NAME}-NativeChannel iOS send message`, data);
            if ((_c = (_b = (_a = window.webkit) === null || _a === void 0 ? void 0 : _a.messageHandlers) === null || _b === void 0 ? void 0 : _b[this.useChannelName]) === null || _c === void 0 ? void 0 : _c.postMessage) {
                window.webkit.messageHandlers[this.useChannelName].postMessage(data);
            }
            else {
                this.logger.error(`${constant_1.SDK_NAME}-NativeChannel iOS: bridge not found in messageHandlers, name =`, this.useChannelName);
            }
        }
        else {
            this.logger.error(`${constant_1.SDK_NAME}-NativeChannel platform not supported, userAgent = `, window.navigator.userAgent);
        }
    }
    static dataToString(data) {
        return typeof data === 'string' ? data : JSON.stringify(data);
    }
}
exports.NativeChannel = NativeChannel;
