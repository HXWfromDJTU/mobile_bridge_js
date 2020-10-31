export interface IChannel {
  postMessage (data: any): void
}


export interface IPromise {
  resolve: Function,
  reject: Function,
  path: string,
  createdAt: Date
}

