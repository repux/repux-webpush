const Joi = require('joi');

export const GatewayMessageSchema = Joi.object()
    .keys({
        recipientAddress: Joi.string().required(),
        params: Joi.object({
            title: Joi.string().required(),
            message: Joi.string().required()
        })
    })
    .unknown(false);
