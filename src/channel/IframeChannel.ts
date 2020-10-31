import { IChannel } from '../interface'

export class IframeChannel implements IChannel {
  postMessage (data: any): void {
    window.parent.postMessage(data, '*') // 不限制接收源
  }
}

