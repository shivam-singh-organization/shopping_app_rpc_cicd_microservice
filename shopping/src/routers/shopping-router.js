const express = require('express');
const shoppingController = require('../controllers/shopping-controller');
const authenticate = require("../middlewares/auth");
const validate = require('../middlewares/validate');
const { placeOrderSchema } = require('../validation/shopping-validation');

const router = express.Router();

module.exports = (channel) => {

    const {
        placeOrder,
        getOrders,
        getCart
    } = shoppingController(channel);

    router.post('/order', authenticate, validate(placeOrderSchema), placeOrder);

    router.get('/orders', authenticate, getOrders);
    router.get('/cart', authenticate, getCart);

    return router;

}
