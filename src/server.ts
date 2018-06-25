import express from 'express';
import mongoose from 'mongoose';
import config from './config/config';
import logger from './utils/logger';
import bodyParser from 'body-parser';
import { IndexController } from './controllers/indexController';
import { RegisterController } from './controllers/registerController';

const app: express.Application = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(headers);

app.use('/', IndexController);
app.use('/register', RegisterController);

mongoose.connect(config.mongodbUri).then(run)
    .catch(err => {
        logger.error('MongoDB connection error. Please make sure MongoDB is running. ' + err);
        process.exit();
    });

function run() {
    app.listen(config.port, () => {
        logger.info(`Listening on port: ${config.port}, public key: ${config.webpush.publicKey}`);
    });
}

function headers(request: any, response: any, next: any) {
    response.setHeader('Access-Control-Allow-Origin', config.accessControlAllowOrigin);
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
    next();
};