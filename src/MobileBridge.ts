import * as EventEmitter from 'eventemitter3'
import { IChannel, IMessage, IRequest, IResponse } from './interface'
import { IPromise } from './interface'
import { IframeChannel } from './channel/IframeChannel'
import * as LoggerLevel from 'loglevel'
import { isIframeEnv, isNotify, isRequest, isResponse } from './helper'
import {
  EXPIRE_DURATION,
  HEARTBEAT_DURATION,
  JSON_RPC_KEY,
  JSON_RPC_VERSION, NativeSDKGlobalKey,
  NOTIFY_PREFIX,
  SDK_NAME
} from './constant'
import { RES_CODE } from './constant/rescode'
import { NativeChannel } from './channel/NativeChannel'
import { ApiDict } from './types'
const uniqueId = require('lodash.uniqueid')

export default class MobileBridge extends EventEmitter {
  public logger: any = LoggerLevel.getLogger(SDK_NAME)
  public apiDict: ApiDict

  protected _channel: IChannel
  protected _promises: Map<string, IPromise> = new Map()
  protected _roundTripTimer: any

  constructor(apiDict: ApiDict) {
    super()

    this.apiDict = apiDict ? apiDict : {}

    // 初始化信道
    if (isIframeEnv()) {
      console.debug(`${SDK_NAME}.init: use IframeChannel`)

      // 发消息
      this._channel = new IframeChannel(console)

      // 接收消息
      window.onmessage = (event: any): void => {
        this.logger.debug(`${SDK_NAME}-iframe-receive message, ready to handle`, event)

        if (event.data
            && typeof event.data === 'string'
            && event.data.includes(`"${ JSON_RPC_KEY }":"${ JSON_RPC_VERSION }"`)) {

          // 向子页面传递消息 (向下传递)
          this.response(event.data)
        }
      }
    }
    else {
      console.debug(`${SDK_NAME}.init: use NativeChannel`)

      // 使用 native channel 封装 各平台的 webview postMessage 的api
      this._channel = new NativeChannel(NativeSDKGlobalKey, console)
    }

    // 绑定 API_DICT 实例到 Bridge 上
    for (const key of Object.keys(this.apiDict)) {
      // 实例化api, 并使用 MobileBridge 作为信道，并绑定到全局
      this[key] = new this.apiDict[key](this)
    }

    // 添加请求 RTT 过长警告  todo: 清理计时器
    this._roundTripTimer = setInterval((): void => {
      for (const [msgId, callbackPromise] of this._promises.entries()) {
        const RTT = new Date().getTime() - callbackPromise.createdAt.getTime()

        if (RTT) {
          this.logger.warn(`${SDK_NAME}-checking: request RTT is over ${EXPIRE_DURATION}, method: `, callbackPromise.method)
        }
      }
    }, HEARTBEAT_DURATION)
  }

  response (data: string) {
    // 尝试转换为 JSON 格式消息
    let message: any
    try {
      message = JSON.parse(data)
      this.logger.debug(`${SDK_NAME}-response receive:`, data)
    }
    catch (err) {
      this.logger.error(`${SDK_NAME}-response parse data error.`, data)
      return
    }

    if (isNotify(message)) {
      const { id, event } = message

      this.logger.debug(`${SDK_NAME}: receive ${event} notify`, id)
      // 收到请求，使用事件机制对外暴露
      this.emit(`${NOTIFY_PREFIX}:${event}`, data)
      return
    }

    // 该消息为 请求类型 的消息
    if (isRequest(message)) {
      const { id, method, params } = message

      this.logger.debug(`${SDK_NAME}: receive request`, id)
      // 收到请求，使用事件机制对外暴露
      this.emit(`${NOTIFY_PREFIX}:${method}`, params)
      return
    }

    // 该消息为 响应类型 的消息
    if (isResponse(message)) {
      const { id, errCode, data, errMsg } = message

      // 从请求记录中，找到请求时设定的promise处理
      const callbackPromise = this._promises.get(id)

      if (callbackPromise) {
        // 判断是否超时,给出警告
        const RTT = new Date().getTime() - callbackPromise.createdAt.getTime()
        if (RTT > EXPIRE_DURATION) {
          this.logger.warn(`${ SDK_NAME }-response: receive response more than ${ EXPIRE_DURATION }s`)
        }

        // 移除对对应的promise
        this._promises.delete(id)
        this.logger.debug(`${ SDK_NAME }-response, remove callback promise, id = ${ id }`)

        // 执行对应的callback promise
        if (errCode === RES_CODE.success) {
          this.logger.debug(`${ SDK_NAME }-response: response data`, data)
          // 调用 reject 方法处理异常回复
          callbackPromise.resolve.call(this, data)
        }
        else {
          this.logger.debug(`${ SDK_NAME }-response: received error`, errMsg)
          // 调用 resolve 方法处理正常回复
          callbackPromise.reject.call(this, errMsg)
        }
      }
      else {
        // 发现是 response 消息，但本地没有找到 对应请求 promise 记录
        this.logger.error(`${ SDK_NAME }-response, no promise for this message`, message)
        return
      }
    }
  }

  /**
   * 发送消息
   * @param payload 发送的数据体
   * @param isNotify
   */
  request (payload: any, isNotify = false) {
    return new Promise((resolve, reject) => {
      // 包装请求
      payload = Object.assign(payload, {
        id: isNotify ? NOTIFY_PREFIX : uniqueId(`${SDK_NAME}-`),
        [JSON_RPC_KEY]: JSON_RPC_VERSION
      })

      // 若发送的不是一个 通知类型 的消息，则需要记录其处理方式
      if (!isNotify) {
        this.logger.debug(`${SDK_NAME}-request add callback promise, id =`, payload.id)
        // 使用 Map 保存请求对应的处理promise
        this._promises.set(payload.id, {
          resolve,
          reject,
          method: payload.method,
          createdAt: new Date(),
        })
      }

      this.logger.debug(`${SDK_NAME}-request message will be sent, payload =`, payload)
      this._channel.postMessage(payload)
    })
  }
}
