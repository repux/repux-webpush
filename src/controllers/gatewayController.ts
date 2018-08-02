import {Router, Request, Response} from 'express';
import HttpStatus from 'http-status-codes';
import {GatewayMessageSchema} from "../validation/gateway-message.schema";
import sendNotification from "../services/sendNotification";
import {default as SubscriptionModel, SubscriptionModelType} from "../models/SubscriptionModel";
import logger from "../utils/logger";

const router: Router = Router();

router.post('/', async (request: Request, response: Response) => {
    const message = request.body;
    const validation = GatewayMessageSchema.validate(message);

    if (validation.error) {
        return sendResponse(response, false, validation.error.toString(), HttpStatus.BAD_REQUEST);
    }

    const subscriptions = await SubscriptionModel
        .find({
            address: message.recipientAddress
        }) as SubscriptionModelType[];

    if (subscriptions.length === 0) {
        return sendResponse(response, false, 'No subscriptions found.');
    }

    const promises = [];

    try {
        for (let subscription of subscriptions) {
            const data = JSON.parse(subscription.body);
            promises.push(sendNotification(data, message.params));

            logger.info(`Notifying #${message.recipientAddress}...`);
        }
    } catch (error) {
        logger.error(error);

        return sendResponse(response, false, 'Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    logger.info(`Waiting for all notifications to be trasferred...`);
    await Promise.all(promises);
    logger.info(`Done.`);

    return sendResponse(response);
});

function sendResponse(response: any, success: boolean = true, message: string = '', status: number = HttpStatus.OK) {
    return response
        .status(status)
        .json({success, message});
}

export const GatewayController: Router = router;
