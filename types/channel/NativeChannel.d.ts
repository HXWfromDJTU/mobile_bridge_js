import { IChannel } from '../interface';
export declare class NativeChannel implements IChannel {
    logger: any;
    useChannelName: string;
    protected isIOS: boolean;
    protected isAndroid: boolean;
    /**
     *
     * @param useChannelName 当前用于通信的信道对象，在window上的key值
     * @param logger
     */
    constructor(useChannelName: string, logger: any);
    postMessage(data: any): void;
    static dataToString(data: any): string;
}
