const ProductService = require("../services/product-service");
const asyncHandler = require("../utils/async-handler");
const { CUSTOMER_BINDING_KEY, SHOPPING_BINDING_KEY } = require("../config/env");
const { PublishMessage } = require("../utils");

module.exports = (channel) => {

    const productService = new ProductService();

    return {
        createProduct: asyncHandler(async (req, res, next) => {
            const { name, desc, type, unit, price, available, supplier, banner } = req.body;
            const { data } = await productService.CreateProduct({ name, desc, type, unit, price, available, supplier, banner });
            return res.json(data);
        }),

        getProductsByCategory: asyncHandler(async (req, res, next) => {
            const category = req.params.type;
            const { data } = await productService.GetProductsByCategory(category);
            return res.json(data);
        }),

        getProductDescription: asyncHandler(async (req, res, next) => {
            const productId = req.params.id;
            const { data } = await productService.GetProductDescription(productId);
            return res.json(data);
        }),

        getSelectedProducts: asyncHandler(async (req, res, next) => {
            const { ids } = req.body;
            const { data } = await productService.GetSelectedProducts(ids);
            return res.json(data);
        }),

        addToWishlist: asyncHandler(async (req, res, next) => {
            const { _id } = req.user;
            const productId = req.body._id;
            const { data } = await productService.GetProductPayload(_id, { productId }, "ADD_TO_WISHLIST");
            PublishMessage(channel, CUSTOMER_BINDING_KEY, JSON.stringify(data));
            return res.json(data.data.product);
        }),

        removeFromWishlist: asyncHandler(async (req, res, next) => {
            const { _id } = req.user;
            const productId = req.params.id;
            const { data } = await productService.GetProductPayload(_id, { productId }, "REMOVE_FROM_WISHLIST");
            PublishMessage(channel, CUSTOMER_BINDING_KEY, JSON.stringify(data));
            return res.json(data.data.product);
        }),

        manageCart: asyncHandler(async (req, res, next) => {
            const userId = req.user._id;
            const { _id, qty } = req.body;
            const { data } = await productService.GetProductPayload(userId, { productId: _id, qty: qty }, "ADD_TO_CART");
            PublishMessage(channel, CUSTOMER_BINDING_KEY, JSON.stringify(data));
            PublishMessage(channel, SHOPPING_BINDING_KEY, JSON.stringify(data));
            return res.json(data.data.product);
        }),

        removeFromCart: asyncHandler(async (req, res, next) => {
            const { _id } = req.user;
            const productId = req.params.id;
            const { data } = await productService.GetProductPayload(_id, { productId }, "REMOVE_FROM_CART");
            PublishMessage(channel, CUSTOMER_BINDING_KEY, JSON.stringify(data));
            PublishMessage(channel, SHOPPING_BINDING_KEY, JSON.stringify(data));
            return res.json(data.data.product);
        }),

        getProducts: asyncHandler(async (req, res, next) => {
            const { data } = await productService.GetProducts();
            return res.json(data);
        }),
    }
};
