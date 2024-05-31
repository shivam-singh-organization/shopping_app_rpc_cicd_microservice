const { ShoppingRepository } = require("../repositories");
const { formatData } = require("../utils");

class ShoppingService {
    constructor() {
        this.repository = new ShoppingRepository();
    }

    async GetCart(customerId) {
        const cartItems = await this.repository.getCart(customerId);
        return formatData(cartItems);
    }

    async PlaceOrder(userInput) {
        const { _id, txnNumber } = userInput;
        const orderResult = await this.repository.createNewOrder(_id, txnNumber);
        return formatData(orderResult);
    }

    async GetOrders(customerId) {
        const orders = await this.repository.getOrders(customerId);
        return formatData(orders);
    }

    async ManageCart(customerId, item, qty, isRemove) {
        const cartResult = await this.repository.addCartItem(customerId, item, qty, isRemove);
        return formatData(cartResult);
    }

    async SubscribeEvents(payload) {

        payload = JSON.parse(payload);
        
        const { event, data } = payload;
        const { userId, product, qty } = data;

        switch (event) {
            case 'ADD_TO_CART':
                this.ManageCart(userId, product, qty, false);
                break;
            case 'REMOVE_FROM_CART':
                this.ManageCart(userId, product, qty, true);
                break;
            default:
                break;
        }
    }

    async GetOrderPayload(userId, order, event) {
        if (order) {
            const payload = {
                event: event,
                data: { userId, order }
            };

            return payload
        } else {
            return formatData({ error: 'No Order Available' });
        }
    }

}

module.exports = ShoppingService;
