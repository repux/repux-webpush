import logger from './../utils/logger';
import messages from './../messages/notificationMessage';
import sendNotification from '../services/sendNotification';
import { default as SubscriptionModel, SubscriptionModelType } from './../models/SubscriptionModel';
import MetadataService from '../services/MetadataService';
import DataProductContract from '../contracts/DataProductContract';

export default async (dataProductAddress: string, sender: string) => {
  const dataProductContract = new DataProductContract(dataProductAddress);
  const metaHash = await dataProductContract.sellerMetaHash();
  const { title } = await MetadataService.getProductMetadata(metaHash);

  SubscriptionModel.find({ address: sender }, (err: any, subscriptions: SubscriptionModelType[]) => {
    if (!subscriptions) {
      return;
    }

    subscriptions.forEach(subscription => {
      const data = JSON.parse(subscription.body);

      sendNotification(data, messages.finaliseNotification(dataProductAddress, title));

      logger.info(`[notification][finalise] send to: ${sender} for product: ${dataProductAddress}`);
    })
  });
}
