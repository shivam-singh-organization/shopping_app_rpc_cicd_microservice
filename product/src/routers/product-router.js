const express = require('express');
const productController = require('../controllers/product-controller');
const authenticate = require("../middlewares/auth");
const validate = require('../middlewares/validate');
const {
    createProductSchema,
    productIdSchema,
    categorySchema,
    selectedIdsSchema,
    manageCartSchema
} = require('../validation/product-validation');

const router = express.Router();

module.exports = (channel) => {

    const {
        createProduct,
        getProductsByCategory,
        getProductDescription,
        getSelectedProducts,
        addToWishlist,
        removeFromWishlist,
        manageCart,
        removeFromCart,
        getProducts
    } = productController(channel);

    router.post('/product/create', authenticate, validate(createProductSchema), createProduct);
    router.post('/ids', authenticate, validate(selectedIdsSchema), getSelectedProducts);

    router.put('/wishlist', authenticate, addToWishlist);
    router.put('/cart', authenticate, validate(manageCartSchema), manageCart);

    router.get('/category/:type', authenticate, validate(categorySchema), getProductsByCategory);
    router.get('/:id', authenticate, validate(productIdSchema), getProductDescription);
    router.get('/', authenticate, getProducts);

    router.delete('/wishlist/:id', authenticate, validate(productIdSchema), removeFromWishlist);
    router.delete('/cart/:id', authenticate, removeFromCart);

    return router;
}
