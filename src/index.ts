import MobileBridge from './MobileBridge'
import { SDK_NAME } from './constant'
const mobileBridge = new MobileBridge()
window[SDK_NAME] = mobileBridge

export default mobileBridge
