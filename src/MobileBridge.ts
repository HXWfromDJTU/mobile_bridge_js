import * as EventEmitter from 'eventemitter3'
import { IChannel } from './interface'
import { IPromise } from './interface'
import pkg = require('../package.json')
import { IframeChannel } from './channel/IframeChannel'
import { Logger } from 'loglevel'
import { isNotify } from './helper'

export class MobileBridge extends EventEmitter {
  public logger: Logger
  protected _channel: IChannel
  protected _promises: Map<string, IPromise>
  protected _timer: any
  protected

  version = pkg.version

  constructor() {
    super()

    // 使用 Iframe
    if (window.self !== window.top) {
      this._channel = new IframeChannel()
      window.onmessage = (event: any): void => {
        // 确认消息格式
        if (event.data
            && typeof event.data === 'string'
            && event.data.includes(`"${JSONRPC_KEY}":"${JSONRPC_VERSION}"`)) {
          // todo: 回复消息
          this.response(event.data)
        }
      }
    }
  }

  response (data: string) {
    // 尝试转换为 JSON 格式消息
    let message: any
    try {
      message = JSON.parse(data)
      this.logger.debug(`${SDK_NAME}.response receive:`, data)
    }
    catch (err) {
      this.logger.error(`${SDK_NAME}.response parse data error.`, data)
      return
    }

    const { id, method, params } = message

    // 根据是否通知类型的消息，做出不同处理
    if (isNotify(message)) {

    } else {
      // 从请求记录中，找到请求时设定的promise处理
      const promise = this._promises.get(id)
    }
  }
}
