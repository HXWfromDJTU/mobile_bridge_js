import { IChannel } from '../interface'
import { SDK_NAME } from '../constant'

export class IframeChannel implements IChannel {
  logger: any

  constructor(logger) {
    this.logger = logger
  }


  postMessage (data: any): void {
    this.logger.debug(`${SDK_NAME}-try sending through IframeChannel`)
    // 将消息向父容器转发过去 (向外层传递)
    window.parent.postMessage(data, '*') // 不限制接收源
  }
}

