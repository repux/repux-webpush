import Web3 from 'web3';
import config from './../config/config';
const contract = require('truffle-contract');

export default class DataProductContract {
    private contract: any;
    private address: string;

    constructor(address: string, provider: any = null) {
        if (!provider) {
            provider = new Web3.providers.HttpProvider(config.ethereum.host);
        }
        this.contract = contract(require('./../../contracts/DataProduct.json'));
        this.contract.setProvider(provider);
        this.address = address;
    }

    public async owner(): Promise<string> {
        let contract = await this.contract.at(this.address);
        return await contract.owner.call() as string;
    }
}