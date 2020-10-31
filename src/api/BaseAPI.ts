import MobileBridge from '../MobileBridge'

export class BaseAPI {
  protected _bridge: MobileBridge

  constructor (bridge: MobileBridge) {
    this._bridge = bridge
  }

  protected _request (payload, isNotify = false): Promise<any> {
    return this._bridge.request(payload, isNotify)
  }
}
