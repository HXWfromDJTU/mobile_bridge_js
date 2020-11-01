export class BaseAPI {
    constructor(bridge) {
        this._bridge = bridge;
    }
    _request(payload, isNotify = false) {
        return this._bridge.request(payload, isNotify);
    }
}
