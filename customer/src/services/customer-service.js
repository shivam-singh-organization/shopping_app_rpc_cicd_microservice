const { CustomerRepository } = require("../repositories");
const { formatData, generatePassword, generateSalt, validatePassword } = require('../utils');
const { generateToken } = require('../utils/jwt');
const { NotFoundError, ValidationError } = require('../utils/errors');

class CustomerService {
    constructor() {
        this.repository = new CustomerRepository();
    }

    async SignIn(userInputs) {
        const { email, password } = userInputs;
        const existingCustomer = await this.repository.findCustomer({ email });

        if (!existingCustomer) {
            throw new NotFoundError('Customer not found');
        }

        const validPassword = await validatePassword(password, existingCustomer.password, existingCustomer.salt);

        if (!validPassword) {
            throw new ValidationError('Invalid credentials');
        }

        const token = generateToken({ email: existingCustomer.email, _id: existingCustomer._id });
        return formatData({ id: existingCustomer._id, token });
    }

    async SignUp(userInputs) {
        const { email, password, phone } = userInputs;

        const isCustomerExist = await this.repository.findCustomer({ email });
        if (isCustomerExist) {
            throw new NotFoundError('Customer already registered');
        }

        const salt = await generateSalt();
        const userPassword = await generatePassword(password, salt);
        const existingCustomer = await this.repository.createCustomer({ email, password: userPassword, phone, salt });
        const token = generateToken({ email: email, _id: existingCustomer._id });

        return formatData({ id: existingCustomer._id, token });
    }

    async AddNewAddress(_id, userInputs) {
        const { street, postalCode, city, country } = userInputs;
        const addressResult = await this.repository.createAddress({ _id, street, postalCode, city, country });
        return formatData(addressResult);
    }

    async GetProfile(id) {
        const existingCustomer = await this.repository.findCustomerById(id);
        if (!existingCustomer) {
            throw new NotFoundError('Customer not found');
        }
        return formatData(existingCustomer);
    }

    async GetShoppingDetails(id) {
        const existingCustomer = await this.repository.findCustomerById(id);
        if (!existingCustomer) {
            throw new NotFoundError('Customer not found');
        }
        return formatData(existingCustomer);
    }

    async GetWishList(customerId) {
        const wishListItems = await this.repository.wishlist(customerId);
        return formatData(wishListItems);
    }

    async AddToWishlist(customerId, product, isRemove) {
        const wishlistResult = await this.repository.addWishlistItem(customerId, product, isRemove);
        return formatData(wishlistResult);
    }

    async ManageCart(customerId, product, qty, isRemove) {
        const cartResult = await this.repository.addCartItem(customerId, product, qty, isRemove);
        return formatData(cartResult);
    }

    async ManageOrder(customerId, order) {
        const orderResult = await this.repository.addOrderToProfile(customerId, order);
        return formatData(orderResult);
    }

    async SubscribeEvents(payload) {

        payload = JSON.parse(payload);
        
        const { event, data } = payload;
        const { userId, product, order, qty } = data;

        switch (event) {
            case 'ADD_TO_WISHLIST':
                await this.AddToWishlist(userId, product, false);
                break;
            case 'REMOVE_FROM_WISHLIST':
                await this.AddToWishlist(userId, product, true);
                break;
            case 'ADD_TO_CART':
                await this.ManageCart(userId, product, qty, false);
                break;
            case 'REMOVE_FROM_CART':
                await this.ManageCart(userId, product, qty, true);
                break;
            case 'CREATE_ORDER':
                await this.ManageOrder(userId, order);
                break;
            case 'TESTING':
                console.log("Inside Subscribe Events Data:", data);
                break;
            default:
                break;
        }
    }
}

module.exports = CustomerService;
