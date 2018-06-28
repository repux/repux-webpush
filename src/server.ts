import fs from 'fs';
import https from 'https';
import http from 'http';
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

const useSSL = config.protocol === 'https';
mongoose.connect(config.mongodbUri).then(useSSL ? runHttpsServer : runHttpServer)
  .catch(err => {
    logger.error(err);
    process.exit();
  });

function runHttpsServer() {

  const httpsConfig = {
    key: fs.readFileSync(config.ssl.keyPath),
    cert: fs.readFileSync(config.ssl.certPath),
    ca: fs.readFileSync(config.ssl.caPath)
  };
  https.createServer(httpsConfig, app).listen(config.port, () => {
    logger.info(`Listening on https, port: ${config.port}, public key: ${config.webpush.publicKey}`);
  });
}

function runHttpServer() {
  http.createServer(app).listen(config.port, () => {
    logger.info(`Listening on http, port: ${config.port}, public key: ${config.webpush.publicKey}`);
  });
}

function headers(request: any, response: any, next: any) {
  response.setHeader('Access-Control-Allow-Origin', config.accessControlAllowOrigin);
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
  next();
};


