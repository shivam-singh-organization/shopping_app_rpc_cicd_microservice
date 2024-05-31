const { ProductRepository } = require("../repositories");
const { formatData } = require("../utils");

class ProductService {
    constructor() {
        this.repository = new ProductRepository();
    }

    async CreateProduct(productInputs) {
        const productResult = await this.repository.createProduct(productInputs);
        return formatData(productResult);
    }

    async GetProducts() {
        const products = await this.repository.findProducts();
        let categories = {};

        products.forEach(({ type }) => {
            categories[type] = type;
        });

        return formatData({
            products,
            categories: Object.keys(categories),
        });
    }

    async GetProductDescription(productId) {
        const product = await this.repository.findById(productId);
        return formatData(product);
    }

    async GetProductsByCategory(category) {
        const products = await this.repository.findByCategory(category);
        return formatData(products);
    }

    async GetSelectedProducts(selectedIds) {
        const products = await this.repository.findSelectedProducts(selectedIds);
        return formatData(products);
    }

    async GetProductById(productId) {
        const product = await this.repository.findById(productId);
        return formatData(product);
    }

    async GetProductPayload(userId, { productId, qty }, event) {
        const product = await this.repository.findById(productId);

        if (product) {
            const payload = {
                event: event,
                data: { userId, product, qty }
            };
            return formatData(payload)
        } else {
            return formatData({ error: 'No product Available' });
        }
    }
}

module.exports = ProductService;
