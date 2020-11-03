"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseAPI_1 = require("./BaseAPI");
class TestModule extends BaseAPI_1.BaseAPI {
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
exports.default = TestModule;
