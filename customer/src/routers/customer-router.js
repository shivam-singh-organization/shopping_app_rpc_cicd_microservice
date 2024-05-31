const express = require('express');
const customerController = require('../controllers/customer-controller');
const authenticate = require("../middlewares/auth");
const validate = require('../middlewares/validate');
const {
    signUpSchema,
    signInSchema,
    addressSchema
} = require('../validation/customer-validation');

const router = express.Router();

module.exports = (channel) => {

    const {
        signUp,
        signIn,
        addNewAddress,
        getProfile,
        getShoppingDetails,
        getWishList
    } = customerController(channel);

    router.post('/signup', validate(signUpSchema), signUp);
    router.post('/login', validate(signInSchema), signIn);
    router.post('/address', validate(addressSchema), authenticate, addNewAddress);

    router.get('/profile', authenticate, getProfile);
    router.get('/shopping-details', authenticate, getShoppingDetails);
    router.get('/wishlist', authenticate, getWishList);

    return router;
}

