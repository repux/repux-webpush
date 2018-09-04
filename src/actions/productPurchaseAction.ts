import logger from './../utils/logger';
import messages from './../messages/notificationMessage';
import sendNotification from '../services/sendNotification';
import DataProductContract from './../contracts/DataProductContract';
import { default as SubscriptionModel, SubscriptionModelType } from './../models/SubscriptionModel';
import MetadataService from '../services/MetadataService';

export default async (dataProductAddress: string, sender: string) => {
  const dataProductContract = new DataProductContract(dataProductAddress);
  const sellerAddress = await dataProductContract.owner();
  const metaHash = await dataProductContract.sellerMetaHash();
  const { title } = await MetadataService.getProductMetadata(metaHash);

  SubscriptionModel.find({ address: sellerAddress }, (err: any, subscriptions: SubscriptionModelType[]) => {
    if (!subscriptions) {
      return;
    }

    subscriptions.forEach(subscription => {
      const data = JSON.parse(subscription.body);
      sendNotification(data, messages.purchaseNotification(dataProductAddress, title))
        .then(() => {
          logger.info(`[notification][purchase] send to: ${sellerAddress} for product: ${dataProductAddress}`);
        })
    })
  });
}
