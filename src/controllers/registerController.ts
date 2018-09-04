import logger from './../utils/logger';
import { Router, Request, Response } from 'express';
import HttpStatus from 'http-status-codes';
import SubscriptionModel, { SubscriptionModelType } from './../models/SubscriptionModel';
import sendNotification from '../services/sendNotification';
import messages from '../messages/notificationMessage';

const router: Router = Router();

router.post('/', async (request: Request, response: Response) => {

    const subscriptionObject = {
        address: request.body.address,
        body: JSON.stringify(request.body.subscription)
    };
    const subscription = new SubscriptionModel(subscriptionObject) as SubscriptionModelType;

    const foundSubscription = await new Promise<Document>(resolve => {
        SubscriptionModel.findOne(subscriptionObject, (err, subscription) => {
             if (err) {
                 resolve();
                 return;
             }

             resolve(<any> subscription);
        });
    });

    if (foundSubscription) {
        return response
            .status(HttpStatus.OK)
            .send();
    }

    //@TODO add validation: const errors = subscription.validateSync();
    let isSuccess = true;
    await subscription.save()
        .then(data => {
            logger.info(`Subscription registered for address: ${subscription.address}`);
        })
        .catch((err:any) => {
            logger.error(`Mongoose error: ${err.message}`, err);
            isSuccess = false;
        });
    
    const data = JSON.parse(subscription.body);
    sendNotification(data, messages.welcomeNotification());
    logger.info(`[notification][welcome] send to: ${subscription.address}`);

    return response
        .status(isSuccess ? HttpStatus.OK : HttpStatus.UNPROCESSABLE_ENTITY)
        .send();
});

export const RegisterController: Router = router;
