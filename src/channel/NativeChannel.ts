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
    if (this.isAndroid) {
      this.logger.debug(`${SDK_NAME}-try sending through Android NativeChannel`, data)

      const bridge = window[this.useChannelName] // window[this.useChannelName] 指向的是 Android 端绑定的对象

      if (bridge && bridge.postMessage) {
        bridge.postMessage(data)
      } else {
        this.logger.error(`${SDK_NAME}-NativeChannel Android: bridge not found in window, name =`, this.useChannelName)
      }
    }
    else if (this.isIOS) {
      this.logger.debug(`${SDK_NAME}-try sending through iOS NativeChannel`, data)

      if ((window as any).webkit?.messageHandlers?.[this.useChannelName]?.postMessage) {
        (window as any).webkit.messageHandlers[this.useChannelName].postMessage(data)
      }
      else {
        // 使用新开页面的形式，客户端端通过约定的 schema，从URL中获取传递的参数
        const iframe = document.createElement('iframe')
        iframe.setAttribute('src', `mobile-bridge://${this.useChannelName}?data=${NativeChannel.dataToString(data)}`)
        iframe.setAttribute('style', 'display: none')
        document.body.appendChild(iframe)

        setTimeout(() => {
          document.body.removeChild(iframe)
        }, 100)
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
