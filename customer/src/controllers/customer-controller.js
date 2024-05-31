const CustomerService = require("../services/customer-service");
const asyncHandler = require("../utils/async-handler");
const { SubscribeMessage } = require("../utils");

module.exports = (channel) => {

    const service = new CustomerService();

    SubscribeMessage(channel, service);

    return {
        signUp: asyncHandler(async (req, res, next) => {
            const { email, password, phone } = req.body;
            const { data } = await service.SignUp({ email, password, phone });
            return res.json(data);
        }),

        signIn: asyncHandler(async (req, res, next) => {
            const { email, password } = req.body;
            const { data } = await service.SignIn({ email, password });
            return res.json(data);
        }),

        addNewAddress: asyncHandler(async (req, res, next) => {
            const { _id } = req.user;
            const { street, postalCode, city, country } = req.body;
            const { data } = await service.AddNewAddress(_id, { street, postalCode, city, country });
            return res.json(data);
        }),

        getProfile: asyncHandler(async (req, res, next) => {
            const { _id } = req.user;
            const { data } = await service.GetProfile(_id);
            return res.json(data);
        }),

        getShoppingDetails: asyncHandler(async (req, res, next) => {
            const { _id } = req.user;
            const { data } = await service.GetShoppingDetails(_id);
            return res.json(data);
        }),

        getWishList: asyncHandler(async (req, res, next) => {
            const { _id } = req.user;
            const { data } = await service.GetWishList(_id);
            return res.json(data);
        })
    }
}

