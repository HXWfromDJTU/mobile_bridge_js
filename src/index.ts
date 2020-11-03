import MobileBridge from './MobileBridge'
import { SDK_NAME, TEST_API_KEY } from './constant'
import API from './api'

// 绑定到全局
window[SDK_NAME] = MobileBridge
window[TEST_API_KEY] = API

export default MobileBridge
