import logger from './../utils/logger';
import { Router, Request, Response } from 'express';
import HttpStatus from 'http-status-codes';
import SubscriptionModel, { SubscriptionModelType } from './../models/SubscriptionModel';

const router: Router = Router();

router.post('/', async (request: Request, response: Response) => {

    const subscriptionObject = {
        address: request.body.address,
        body: JSON.stringify(request.body.subscription)
    };
    const subscription = new SubscriptionModel(subscriptionObject) as SubscriptionModelType;

    const foundSubscription = await new Promise<Document>(resolve => {
        SubscriptionModel.findOne(subscriptionObject, (err, subscription) => {
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

    return response
        .status(isSuccess ? HttpStatus.OK : HttpStatus.UNPROCESSABLE_ENTITY)
        .send();
});

export const RegisterController: Router = router;
