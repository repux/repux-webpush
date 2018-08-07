import Web3 from 'web3';
import config from './config/config';
import mongoose from 'mongoose';
import RegistryContract from './contracts/RegistryContract';
import productFinaliseAction from './actions/productFinaliseAction';
import productPurchaseAction from './actions/productPurchaseAction';
import logger from './utils/logger';

const webpush = require('web-push');

const provider = new Web3.providers.HttpProvider(config.ethereum.host);
const web3 = new Web3(provider);

webpush.setVapidDetails(
    config.webpush.mailto,
    config.webpush.publicKey,
    config.webpush.privateKey
);

mongoose.connect(config.mongodbUri)
    .then(() => {
        web3.eth.getBlockNumber((err, blockNumber) => {
            run(blockNumber, config.ethereum.registryAddress);
        });
    })
    .catch(err => {
        logger.info("Error while starting demon: " + err);
        process.exit();
    });

function run(blockNumber: number, registryAddress: string) {
    logger.info(`[init] Watching for registry ${registryAddress} events from block ${blockNumber} ...`);

    const registryContract = new RegistryContract(registryAddress);
    registryContract
        .on(RegistryContract.EVENT_ACTION_FINALISE, productFinaliseAction)
        .on(RegistryContract.EVENT_ACTION_PURCHASE, productPurchaseAction);

    const config = { fromBlock: blockNumber, toBlock: 'latest' };
    registryContract.watchDataProductUpdate(config);
}
