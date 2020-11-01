export class IframeChannel {
    postMessage(data) {
        window.parent.postMessage(data, '*'); // 不限制接收源
    }
}
