# 设计思路
## 主要构成
* 通信信道
    * 使用Iframe
    * 使用Native Channel
* 请求缓存区，收发制度
* promise 封装
* 客户端的webview 用于加载sdk,dapp可以方面也加载sdk,则可以实现双方互相监听的效果。
    * 如何区分是来自于 mobile_bridge_sdk的呢？而不是其他sdk呢？

## 图例
* 参考了同事 `electron`的多窗口、跨进程通信的设计思维    
* 需要补充一个思维导图      

### webapi 
* postMessage
* window.top window.self

### 工具
* log-level
 * 一个优秀的sdk，必须要可以保证日志的可追随性
 
### 打包
* cjs
* esm
* amd

## 参考资料
[1] [window.postMessage - MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/postMessage)      
[2] [logger-level - github](https://github.com/pimterry/loglevel)
