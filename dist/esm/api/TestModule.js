import { BaseAPI } from './BaseAPI';
export default class TestModule extends BaseAPI {
    sendTestMessage() {
        return this._request({
            method: 'test_method',
            params: {}
        });
    }
    getAddressFromAddressBook() {
        return this._request({
            method: 'getAddressFromAddressBook',
            params: {}
        });
    }
}
