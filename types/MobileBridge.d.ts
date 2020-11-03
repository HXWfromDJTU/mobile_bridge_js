import * as EventEmitter from 'eventemitter3';
import { IChannel } from './interface';
import { IPromise } from './interface';
import { ApiDict } from './types';
export default class MobileBridge extends EventEmitter {
    logger: any;
    version: any;
    apiDict: ApiDict;
    protected _channel: IChannel;
    protected _promises: Map<string, IPromise>;
    protected _roundTripTimer: any;
    constructor(apiDict: ApiDict);
    /**
     * response 起到的是 handleRequest 的作用, 可以是内部自动调用，也可以是使用者调用
     * @param data 信道传输过来的 string 消息，期望是 IRequest 格式的 JSON_STRING
     */
    response(data: string): void;
    /**
     * 发送消息
     * @param payload 发送的数据体
     * @param isNotify
     */
    request(payload: any, isNotify?: boolean): Promise<unknown>;
}
