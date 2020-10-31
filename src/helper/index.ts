export function isNotify (message: Object): boolean {
  return true
}

export function isRequest (msgObj: any): boolean {
  const requestKeys = ['jsonrpc', 'id', 'method', 'params']

  // 检查是否符合所有的 IRequest Key
  return requestKeys.every((requestKey: string) => {
    return  msgObj.hasOwnProperty(requestKey)
  })
}

export function isResponse (msgObj: any): boolean {
  const responseKeys = ['jsonrpc', 'id', 'errCode']

  // 检查是否符合所有的 IRequest Key
  return responseKeys.every((requestKey: string) => {
    return  msgObj.hasOwnProperty(requestKey)
  })
}
