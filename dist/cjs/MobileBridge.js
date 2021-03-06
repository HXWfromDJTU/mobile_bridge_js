"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EventEmitter = require("eventemitter3");
const IframeChannel_1 = require("./channel/IframeChannel");
const helper_1 = require("./helper");
const constant_1 = require("./constant");
const rescode_1 = require("./constant/rescode");
const NativeChannel_1 = require("./channel/NativeChannel");
const uniqueId = require('lodash.uniqueid');
class MobileBridge extends EventEmitter {
    constructor(apiDict) {
        super();
        this.logger = window.console;
        this._promises = new Map();
        this.apiDict = apiDict ? apiDict : {};
        // 初始化信道
        if (helper_1.isIframeEnv()) {
            console.debug(`${constant_1.SDK_NAME}.init: use IframeChannel`);
            // 发消息
            this._channel = new IframeChannel_1.IframeChannel();
            // 接收消息
            window.onmessage = (event) => {
                this.logger.debug(`${constant_1.SDK_NAME}-iframe-receive message, ready to handle`, event);
                // 确认消息格式
                if (event.data
                    && typeof event.data === 'string'
                    && event.data.includes(`"${constant_1.JSON_RPC_KEY}":"${constant_1.JSON_RPC_VERSION}"`)) {
                    // todo: 收到消息后，处理消息
                    this.response(event.data);
                }
            };
        }
        else {
            console.debug(`${constant_1.SDK_NAME}.init: use NativeChannel`);
            // 使用 native channel 封装 各平台的 webview postMessage 的api
            this._channel = new NativeChannel_1.NativeChannel(constant_1.NativeSDKGlobalKey, console);
        }
        // 绑定 API_DICT 实例到 Bridge 上
        for (const key of Object.keys(this.apiDict)) {
            // 实例化api, 并使用 MobileBridge 作为信道，并绑定到全局
            this[key] = new this.apiDict[key](this);
        }
        // 添加请求 RTT 过长警告  todo: 清理计时器
        this._roundTripTimer = setInterval(() => {
            for (const [msgId, callbackPromise] of this._promises.entries()) {
                const RTT = new Date().getTime() - callbackPromise.createdAt.getTime();
                if (RTT) {
                    this.logger.warn(`${constant_1.SDK_NAME}-checking: request RTT is over ${constant_1.EXPIRE_DURATION}, method: `, callbackPromise.method);
                }
            }
        }, constant_1.HEARTBEAT_DURATION);
    }
    /**
     * response 起到的是 handleRequest 的作用, 可以是内部自动调用，也可以是使用者调用
     * @param data 信道传输过来的 string 消息，期望是 IRequest 格式的 JSON_STRING
     */
    response(data) {
        // 尝试转换为 JSON 格式消息
        let message;
        try {
            message = JSON.parse(data);
            this.logger.debug(`${constant_1.SDK_NAME}-response receive:`, data);
        }
        catch (err) {
            this.logger.error(`${constant_1.SDK_NAME}-response parse data error.`, data);
            return;
        }
        if (helper_1.isNotify(message)) {
            const { id, data } = message;
            this.logger.debug(`${constant_1.SDK_NAME}: receive notify`, id);
            // 收到请求，使用事件机制对外暴露
            this.emit(`${constant_1.NOTIFY_PREFIX}`, data);
            return;
        }
        // 该消息为 请求类型 的消息
        if (helper_1.isRequest(message)) {
            const { id, method, params } = message;
            this.logger.debug(`${constant_1.SDK_NAME}: receive request`, id);
            // 收到请求，使用事件机制对外暴露
            this.emit(`${constant_1.NOTIFY_PREFIX}:${method}`, params);
            return;
        }
        // 该消息为 响应类型 的消息
        if (helper_1.isResponse(message)) {
            const { id, errCode, data, errMsg } = message;
            // 从请求记录中，找到请求时设定的promise处理
            const callbackPromise = this._promises.get(id);
            if (callbackPromise) {
                // 判断是否超时,给出警告
                const RTT = new Date().getTime() - callbackPromise.createdAt.getTime();
                if (RTT > constant_1.EXPIRE_DURATION) {
                    this.logger.warn(`${constant_1.SDK_NAME}-response: receive response more than ${constant_1.EXPIRE_DURATION}s`);
                }
                // 移除对对应的promise
                this._promises.delete(id);
                this.logger.debug(`${constant_1.SDK_NAME}-response, remove callback promise, id = ${id}`);
                // 执行对应的callback promise
                if (errCode === rescode_1.RES_CODE.success) {
                    this.logger.debug(`${constant_1.SDK_NAME}-response: response data`, data);
                    // 调用 reject 方法处理异常回复
                    callbackPromise.resolve.call(this, data);
                }
                else {
                    this.logger.debug(`${constant_1.SDK_NAME}-response: received error`, errMsg);
                    // 调用 resolve 方法处理正常回复
                    callbackPromise.reject.call(this, errMsg);
                }
            }
            else {
                // 发现是 response 消息，但本地没有找到 对应请求 promise 记录
                this.logger.error(`${constant_1.SDK_NAME}-response, no promise for this message`, message);
                return;
            }
        }
    }
    /**
     * 发送消息
     * @param payload 发送的数据体
     * @param isNotify
     */
    request(payload, isNotify = false) {
        return new Promise((resolve, reject) => {
            // 包装请求
            payload = Object.assign(payload, {
                id: isNotify ? constant_1.NOTIFY_PREFIX : uniqueId(`${constant_1.SDK_NAME}-`),
                [constant_1.JSON_RPC_KEY]: constant_1.JSON_RPC_VERSION
            });
            // 若发送的不是一个 通知类型 的消息，则需要记录其处理方式
            if (!isNotify) {
                this.logger.debug(`${constant_1.SDK_NAME}-request add callback promise, id =`, payload.id);
                // 使用 Map 保存请求对应的处理promise
                this._promises.set(payload.id, {
                    resolve,
                    reject,
                    method: payload.method,
                    createdAt: new Date(),
                });
            }
            this.logger.debug(`${constant_1.SDK_NAME}-request message send, payload =`, payload);
            this._channel.postMessage(payload);
        });
    }
}
exports.default = MobileBridge;
