export interface IChannel {
  postMessage (data: any): void
}


export interface IPromise {
  resolve: Function,
  reject: Function,
  path: string,
  createdAt: Date
}

export interface IMessage {
  jsonrpc: string,
  id: string,
}

export interface IResponse extends IMessage {
  data?: any,
  errCode: number,
  errMsg?: string
}

export interface IRequest extends IMessage {
  method: string, // 请求的方法名
  params: any
}

