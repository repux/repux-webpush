import logger from './../utils/logger';
import messages from './../messages/notificationMessage';
import sendNotification from '../services/sendNotification';
import DataProductContract from './../contracts/DataProductContract';
import { default as SubscriptionModel, SubscriptionModelType } from './../models/SubscriptionModel';

export default async (dataProductAddress: string, sender: string) => {
  const dataProductContract = new DataProductContract(dataProductAddress);
  const sellerAddress = await dataProductContract.owner();

  SubscriptionModel.find({ address: sellerAddress }, (err: any, subscriptions: SubscriptionModelType[]) => {
    if (!subscriptions) {
      return;
    }

    subscriptions.forEach(subscription => {
      const data = JSON.parse(subscription.body);
      sendNotification(data, messages.purchaseNotification)
        .then(() => {
          logger.info(`Purchase notification send to: ${sellerAddress} for product: ${dataProductAddress}`);
        })
    })
  });
}
