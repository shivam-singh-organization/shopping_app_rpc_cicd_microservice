const express = require('express');
const cors = require('cors');
const shoppingRoutes = require('./routers/shopping-router');
const errorHandler = require('./middlewares/error-handler');
const responseHandler = require('./middlewares/response-handler');

module.exports = async (app, channel) => {

    app.use(express.json({ limit: '1mb' }));
    app.use(express.urlencoded({ extended: true, limit: '1mb' }));
    app.use(cors());
    app.use(express.static(__dirname + '/public'));

    // Global response handler
    app.use(responseHandler);

    //api
    app.use('/', shoppingRoutes(channel));

    // Global error handler
    app.use(errorHandler);
};
