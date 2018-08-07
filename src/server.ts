import fs from 'fs';
import https from 'https';
import http from 'http';
import express from 'express';
import mongoose from 'mongoose';
import config from './config/config';
import logger from './utils/logger';
import bodyParser from 'body-parser';
import {IndexController} from './controllers/indexController';
import {RegisterController} from './controllers/registerController';
import {GatewayController} from "./controllers/gatewayController";

const webpush = require('web-push');
const auth = require('http-auth');

webpush.setVapidDetails(
    config.webpush.mailto,
    config.webpush.publicKey,
    config.webpush.privateKey
);

const app: express.Application = express();

const basic = auth.basic(
    { realm: 'RepuX WebPush' },
    (username: string, password: string, callback: Function) => {
        callback(username === config.gateway.auth.user && password === config.gateway.auth.password);
    }
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(headers);

app.use('/', IndexController);
app.use('/register', RegisterController);

if (config.gateway.auth.user && config.gateway.auth.password) {
    app.use('/gateway', auth.connect(basic), GatewayController);
    logger.info('Gateway enabled.');
}

const serverConfig = {
    host: config.host,
    port: config.port
};

const useSSL = config.protocol === 'https';

mongoose.connect(config.mongodbUri).then(useSSL ? runHttpsServer : runHttpServer)
    .catch(err => {
        logger.error(err);
        process.exit();
    });

function runHttpsServer() {
    const httpsConfig = {
        key: fs.readFileSync(config.ssl.keyPath),
        cert: fs.readFileSync(config.ssl.certPath)
    };
    https.createServer(httpsConfig, app).listen(serverConfig, () => {
        logger.info(`Listening on https://${config.host}:${config.port}, public key: ${config.webpush.publicKey}`);
    });
}

function runHttpServer() {
    http.createServer(app).listen(serverConfig, () => {
        logger.info(`Listening on http://${config.host}:${config.port}, public key: ${config.webpush.publicKey}`);
    });
}

function headers(request: any, response: any, next: any) {
    response.setHeader('Access-Control-Allow-Origin', config.accessControlAllowOrigin);
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
    next();
}


