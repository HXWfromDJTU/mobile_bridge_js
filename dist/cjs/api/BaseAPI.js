"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseAPI = void 0;
class BaseAPI {
    constructor(bridge) {
        this._bridge = bridge;
    }
    _request(payload, isNotify = false) {
        return this._bridge.request(payload, isNotify);
    }
}
exports.BaseAPI = BaseAPI;
