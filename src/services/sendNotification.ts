import logger from './../utils/logger';
const webpush = require('web-push');

export default function sendNotification(data: any, params: any) {
    return webpush.sendNotification(data, JSON.stringify(params), {})
        .catch((error: any) => {
            logger.error(`Notification: ${error.message}`);
            // @TODO - after receive "Not registered" response - remove subscription from db
        });
}
