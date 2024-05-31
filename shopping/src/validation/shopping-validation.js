const Joi = require('joi');

const placeOrderSchema = Joi.object({
    body: Joi.object({
        txnNumber: Joi.string().required()
    })
});

module.exports = { placeOrderSchema };
