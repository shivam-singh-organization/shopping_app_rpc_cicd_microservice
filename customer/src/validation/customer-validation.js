const Joi = require('joi');

const signUpSchema = Joi.object({
    body: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        phone: Joi.string().min(10).required()
    })
});

const signInSchema = Joi.object({
    body: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    })
});

const addressSchema = Joi.object({
    body: Joi.object({
        street: Joi.string().required(),
        postalCode: Joi.string().required(),
        city: Joi.string().required(),
        country: Joi.string().required()
    })
});

module.exports = { signUpSchema, signInSchema, addressSchema };
