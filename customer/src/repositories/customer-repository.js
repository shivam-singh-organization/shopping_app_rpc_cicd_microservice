const { CustomerModel, AddressModel } = require("../models");
const { APIError, NotFoundError } = require("../utils/errors");
const { INTERNAL_ERROR } = require("../utils/status-codes");

class CustomerRepository {
  async createCustomer({ email, password, phone, salt }) {
    try {
      const customer = new CustomerModel({ email, password, salt, phone, address: [] });
      return await customer.save();
    } catch (err) {
      throw new APIError("Unable to create customer", INTERNAL_ERROR, err.message);
    }
  }

  async createAddress({ _id, street, postalCode, city, country }) {
    try {
      const profile = await CustomerModel.findById(_id);
      if (!profile) throw new NotFoundError("Customer not found");

      const newAddress = new AddressModel({ street, postalCode, city, country });
      await newAddress.save();

      profile.address.push(newAddress);
      return await profile.save();
    } catch (err) {
      throw new APIError("Error creating address", INTERNAL_ERROR, err.message);
    }
  }

  async findCustomer({ email }) {
    try {
      return await CustomerModel.findOne({ email });
    } catch (err) {
      throw new APIError("Unable to find customer", INTERNAL_ERROR, err.message);
    }
  }

  async findCustomerById(id) {
    try {
      return await CustomerModel.findById(id).populate("address");
    } catch (err) {
      throw new APIError("Unable to find customer", INTERNAL_ERROR, err.message);
    }
  }

  async wishlist(customerId) {
    try {
      const profile = await CustomerModel.findById(customerId).populate("wishlist");
      return profile.wishlist;
    } catch (err) {
      throw new APIError("Unable to get wishlist", INTERNAL_ERROR, err.message);
    }
  }

  async addWishlistItem(customerId, product, isRemove) {
    try {
      const profile = await CustomerModel.findById(customerId).populate("wishlist");
      if (!profile) throw new NotFoundError("Customer not found");

      let wishlist = profile.wishlist || [];
      const existingIndex = wishlist.findIndex(item => item._id.toString() === product._id.toString());

      if (existingIndex !== -1) {
        if (isRemove) {
          wishlist.splice(existingIndex, 1);
        }
      } else {
        if (!isRemove) {
          wishlist.push(product);
        }
      }

      profile.wishlist = wishlist;
      const updatedProfile = await profile.save();

      return updatedProfile.wishlist;
    } catch (err) {
      throw new APIError("Unable to add to wishlist", INTERNAL_ERROR, err.message);
    }
  }

  async addCartItem(customerId, product, qty, isRemove) {
    try {
      const profile = await CustomerModel.findById(customerId).populate("cart");
      if (!profile) throw new NotFoundError("Customer not found");

      let cartItems = profile.cart || [];
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

      profile.cart = cartItems;
      const updatedCart = await profile.save();

      return updatedCart.cart;
    } catch (err) {
      throw new APIError("Unable to add to cart", INTERNAL_ERROR, err.message);
    }
  }

  async addOrderToProfile(customerId, order) {
    try {
      const profile = await CustomerModel.findById(customerId);
      if (!profile) throw new NotFoundError("Customer not found");

      profile.orders = profile.orders || [];
      profile.orders.push(order);
      profile.cart = [];

      return await profile.save();
    } catch (err) {
      throw new APIError("Unable to add order to profile", INTERNAL_ERROR, err.message);
    }
  }
}

module.exports = CustomerRepository;
