import { BaseAPI } from './BaseAPI'

export default class TestModule extends BaseAPI {
  private sendTestMessage () {
    return this._request({
      method: 'test_method',
      params: {}
    })
  }
}
