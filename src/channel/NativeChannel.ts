import { IChannel } from '../interface'
import { getAllUserAgent } from '../helper'
import { SDK_NAME } from '../constant'

export class NativeChannel implements IChannel {
  public logger: any
  public useChannelName: string

  protected isIOS = false
  protected isAndroid = false

  /**
   *
   * @param useChannelName 当前用于通信的信道对象，在window上的key值
   * @param logger
   */
  constructor (useChannelName: string, logger: any) {
    const UAInfo = getAllUserAgent()
    this.logger = logger
    this.useChannelName = useChannelName

    this.isIOS = UAInfo.ios
    this.isAndroid = UAInfo.android
  }

  postMessage (data: any): void {
    this.logger.debug(`${SDK_NAME}-NativeChannel send message`, data)

    if (this.isAndroid) {
      this.logger.debug(`${SDK_NAME}-NativeChannel Android send message`, data)
      const bridge = window[this.useChannelName]

      if (bridge && bridge.postMessage) {
        bridge.postMessage(NativeChannel.dataToString(data))
      } else {
        this.logger.error(`${SDK_NAME}-NativeChannel Android: bridge not found in window, name =`, this.useChannelName)
      }
    }
    else if (this.isIOS) {
      this.logger.debug(`${SDK_NAME}-NativeChannel iOS send message`, data)

      if (window.webkit
        && window.webkit.messageHandlers
        && window.webkit.messagehandlers[this.useChannelName]
        && window.webkit.messageHandlers[this.useChannelName].postMessage) {

        window.webkit.messageHandlers[this.useChannelName].postMessage(data)
      }
      else {
        this.logger.error(`${ SDK_NAME }-NativeChannel iOS: bridge not found in messageHandlers, name =`, this.useChannelName)
      }
    }
    else {
      this.logger.error(`${ SDK_NAME }-NativeChannel platform not supported, userAgent = `, window.navigator.userAgent)
    }
  }

  static dataToString (data: any) {
    return typeof data === 'string' ? data : JSON.stringify(data)
  }
}
