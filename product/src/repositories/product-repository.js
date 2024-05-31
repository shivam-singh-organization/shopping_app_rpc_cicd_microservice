const { ProductModel } = require("../models");
const { APIError, NotFoundError } = require("../utils/errors");
const { INTERNAL_ERROR } = require("../utils/status-codes");

class ProductRepository {
    async createProduct({ name, desc, type, unit, price, available, supplier, banner }) {
        try {
            const product = new ProductModel({ name, desc, type, unit, price, available, supplier, banner });
            return await product.save();
        } catch (err) {
            throw new APIError("Unable to create product", INTERNAL_ERROR, err.message);
        }
    }

    async findProducts() {
        try {
            return await ProductModel.find();
        } catch (err) {
            throw new APIError("Unable to get products", INTERNAL_ERROR, err.message);
        }
    }

    async findById(id) {
        try {
            const product = await ProductModel.findById(id);
            if (!product) throw new NotFoundError("Product not found");
            return product;
        } catch (err) {
            throw new APIError("Unable to find product", INTERNAL_ERROR, err.message);
        }
    }

    async findByCategory(category) {
        try {
            return await ProductModel.find({ type: category });
        } catch (err) {
            throw new APIError("Unable to find category", INTERNAL_ERROR, err.message);
        }
    }

    async findSelectedProducts(selectedIds) {
        try {
            return await ProductModel.find().where("_id").in(selectedIds.map((_id) => _id)).exec();
        } catch (err) {
            throw new APIError("Unable to find products", INTERNAL_ERROR, err.message);
        }
    }
}

module.exports = ProductRepository;
