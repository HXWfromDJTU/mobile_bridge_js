import { BaseAPI } from './BaseAPI';
export default class TestModule extends BaseAPI {
    sendTestMessage(): Promise<any>;
    getAddressFromAddressBook(): Promise<string>;
}
