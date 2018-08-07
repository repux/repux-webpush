import logger from './../utils/logger';
import messages from './../messages/notificationMessage';
import sendNotification from '../services/sendNotification';
import { default as SubscriptionModel, SubscriptionModelType } from './../models/SubscriptionModel';

export default (dataProductAddress: string, sender: string) => {

  SubscriptionModel.find({ address: sender }, (err: any, subscriptions: SubscriptionModelType[]) => {
    if (!subscriptions) {
      return;
    }

    subscriptions.forEach(subscription => {
      const data = JSON.parse(subscription.body);
      sendNotification(data, messages.approveNotification);

      logger.info(`[notification][finalise] send to: ${sender} for product: ${dataProductAddress}`);

    })
  });
}
