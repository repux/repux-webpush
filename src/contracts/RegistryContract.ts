import Web3 from 'web3';
import { EventEmitter } from 'events';
import config from './../config/config';
const contract = require('truffle-contract');

export default class RegistryContract extends EventEmitter {
    static EVENT_ACTION_CREATE: string = '0';
    static EVENT_ACTION_UPDATE: string = '1';
    static EVENT_ACTION_DELETE: string = '2';
    static EVENT_ACTION_PURCHASE: string = '3';
    static EVENT_ACTION_CANCEL_PURCHASE: string = '4';
    static EVENT_ACTION_FINALISE: string = '5';
    static EVENT_ACTION_RATE: string = '6';

    private contract: any;
    private address: string;

    constructor(address: string, provider: any = null) {
        super();

        if (!provider) {
            provider = new Web3.providers.HttpProvider(config.ethereum.host);
        }

        this.contract = contract(require('./../../contracts/Registry.json'));
        this.contract.setProvider(provider);
        this.address = address;
    }

    async watchDataProductUpdate(config: any) {
        let contract = await this.contract.at(this.address);
        contract['DataProductUpdate']({}, config).watch(
            (err: any, result: any) => {
                if (result.args) {
                    let { dataProduct, action, sender } = result.args;
                    this.emit(action.toString(), dataProduct, sender);
                }
            }
        );
    }
}
