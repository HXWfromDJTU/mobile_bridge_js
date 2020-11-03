export declare function isRequest(msgObj: any): boolean;
export declare function isNotify(msgObj: any): boolean;
export declare function isResponse(msgObj: any): boolean;
export declare function isIframeEnv(): boolean;
/**
 * 获取当前平台以及应用信息
 */
export declare function getAllUserAgent(): {
    android: boolean;
    ios: boolean;
    windows: boolean;
    ubuntu: boolean;
    mac: boolean;
};
