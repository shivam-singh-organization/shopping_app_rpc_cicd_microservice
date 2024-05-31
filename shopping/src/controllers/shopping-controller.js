const ShoppingService = require("../services/shopping-service");
const asyncHandler = require("../utils/async-handler");
const { SubscribeMessage, PublishMessage } = require("../utils");
const { CUSTOMER_BINDING_KEY } = require("../config/env");

module.exports = (channel) => {

    const shoppingService = new ShoppingService();

    SubscribeMessage(channel, shoppingService);

    return {
        placeOrder: asyncHandler(async (req, res, next) => {
            const { _id } = req.user;
            const { txnNumber } = req.body;
            const { data } = await shoppingService.PlaceOrder({ _id, txnNumber });
            const payload = await shoppingService.GetOrderPayload(_id, data, "CREATE_ORDER");
            PublishMessage(channel, CUSTOMER_BINDING_KEY, JSON.stringify(payload));
            return res.status(200).json(data);
        }),

        getOrders: asyncHandler(async (req, res, next) => {
            const { _id } = req.user;
            const { data } = await shoppingService.GetOrders(_id);
            return res.status(200).json(data);
        }),

        getCart: asyncHandler(async (req, res, next) => {
            const { _id } = req.user;
            const { data } = await shoppingService.GetCart(_id);
            return res.status(200).json(data);
        }),

    }
}
