const Joi = require('joi');

const createProductSchema = Joi.object({
    body: Joi.object({
        name: Joi.string().required(),
        desc: Joi.string().required(),
        type: Joi.string().required(),
        unit: Joi.number().required(),
        price: Joi.number().required(),
        available: Joi.boolean().required(),
        supplier: Joi.string().required(),
        banner: Joi.string().required(),
    })
});

const productIdSchema = Joi.object({
    params: Joi.object({
        id: Joi.string().required()
    })
});

const categorySchema = Joi.object({
    params: Joi.object({
        type: Joi.string().required()
    })
});

const selectedIdsSchema = Joi.object({
    body: Joi.object({
        ids: Joi.array().items(Joi.string().required()).required()
    })
});

const manageCartSchema = Joi.object({
    body: Joi.object({
        _id: Joi.string().required(),
        qty: Joi.number().required()
    })
});

module.exports = { createProductSchema, productIdSchema, categorySchema, selectedIdsSchema, manageCartSchema };
