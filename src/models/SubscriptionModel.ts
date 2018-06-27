import mongoose from 'mongoose';

export type SubscriptionModelType = mongoose.Document & {
    address: string,
    body: string,
    date: Date
  };

const subscriptionSchema = new mongoose.Schema({
    address: {
        type: String,
        index: true,
        validate: {
            validator: (value: String) => {
                return value.length === 42;
            },
            message: '{VALUE} is not a valid wallet address'
        },
    },
    body: String,
    date: { type: Date, default: Date.now }
});

const SubscriptionModel = mongoose.model('Subscription', subscriptionSchema);

export default SubscriptionModel;