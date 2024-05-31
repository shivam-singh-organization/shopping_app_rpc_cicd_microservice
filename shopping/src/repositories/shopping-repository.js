const { CartModel, OrderModel } = require('../models');
const { v4: uuidv4 } = require('uuid');
const { APIError, NotFoundError } = require('../utils/errors');
const { INTERNAL_ERROR } = require('../utils/status-codes');

class ShoppingRepository {

    async getOrders(customerId) {
        try {
            const orders = await OrderModel.find({ customerId });
            return orders;
        } catch (err) {
            throw new APIError('Unable to find orders', INTERNAL_ERROR, err.message);
        }
    }

    async getCart(customerId) {
        try {
            const cartItems = await CartModel.find({ customerId });
            return cartItems;
        } catch (err) {
            throw new APIError('Unable to find cart', INTERNAL_ERROR, err.message);
        }
    }

    async addCartItem(customerId, product, qty, isRemove) {
        try {
            let cart = await CartModel.findOne({ customerId });
            if (!cart) {
                return await CartModel.create({
                    customerId,
                    items: [{ product, unit: qty }]
                })
            }

            let cartItems = cart.items || [];
            const existingIndex = cartItems.findIndex(item => item.product._id.toString() === product._id.toString());

            if (existingIndex !== -1) {
                if (isRemove) {
                    cartItems.splice(existingIndex, 1);
                } else {
                    cartItems[existingIndex].unit = qty;
                }
            } else {
                if (!isRemove) {
                    cartItems.push({ product, unit: qty });
                }
            }

            cart.items = cartItems;
            const updatedCart = await cart.save();

            return updatedCart;
        } catch (err) {
            throw new APIError("Unable to add to cart", INTERNAL_ERROR, err.message);
        }
    }

    async createNewOrder(customerId, txnId) {
        try {
            const cart = await CartModel.findOne({ customerId });
            if (!cart) throw new NotFoundError('Cart not found');

            let amount = 0;
            let cartItems = cart.items;

            if (cartItems.length > 0) {
                cartItems.forEach(item => {
                    amount += parseInt(item.product.price) * parseInt(item.unit);
                });

                const orderId = uuidv4();
                const order = new OrderModel({
                    orderId,
                    customerId,
                    amount,
                    txnId,
                    status: 'received',
                    items: cartItems
                });

                cart.items = [];
                const orderResult = await order.save();
                await cart.save();

                return orderResult;
            } else {
                throw new APIError('No items in cart', INTERNAL_ERROR);
            }
        } catch (err) {
            throw new APIError('Unable to create order', INTERNAL_ERROR, err.message);
        }
    }

}

module.exports = ShoppingRepository;
