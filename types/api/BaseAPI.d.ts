import MobileBridge from '../MobileBridge';
export declare class BaseAPI {
    protected _bridge: MobileBridge;
    constructor(bridge: MobileBridge);
    protected _request(payload: any, isNotify?: boolean): Promise<any>;
}
