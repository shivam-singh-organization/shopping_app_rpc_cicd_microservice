const bcrypt = require("bcryptjs");
const amqplib = require("amqplib");
const { MSG_QUEUE_URL, EXCHANGE_NAME, QUEUE_NAME, CUSTOMER_BINDING_KEY } = require('../config/env');

/**
 * Generate a salt for password hashing.
 * @returns {Promise<string>} A promise that resolves to a salt string.
 */
module.exports.generateSalt = async () => {
    return bcrypt.genSalt();
};

/**
 * Hash the provided password using the given salt.
 * @param {string} password - The password to hash.
 * @param {string} salt - The salt to use for hashing.
 * @returns {Promise<string>} A promise that resolves to the hashed password.
 */
module.exports.generatePassword = async (password, salt) => {
    return bcrypt.hash(password, salt);
};

/**
 * Validate if the entered password matches the saved password.
 * @param {string} enteredPassword - The password entered by the user.
 * @param {string} savedPassword - The hashed password stored in the database.
 * @param {string} salt - The salt used for hashing the password.
 * @returns {Promise<boolean>} A promise that resolves to a boolean indicating whether the passwords match.
 */
module.exports.validatePassword = async (
    enteredPassword,
    savedPassword,
    salt
) => {
    const hashedEnteredPassword = await bcrypt.hash(enteredPassword, salt);
    return hashedEnteredPassword === savedPassword;
};

/**
 * Format data into a standardized response format.
 * @param {*} data - The data to format.
 * @returns {object} The formatted data.
 * @throws {Error} Throws an error if data is not found.
 */
module.exports.formatData = (data) => {
    if (data) {
        return { data };
    } else {
        throw new Error("Data not found!");
    }
};

/*************** Message Broker Functions ***************/

/**
 * Create a channel for message broker.
 * @returns {Promise<amqplib.Channel>} A promise that resolves to the created channel.
 * @throws {Error} Throws an error if unable to create the channel.
 */
module.exports.CreateChannel = async () => {
    let connection;
    try {
        connection = await amqplib.connect(MSG_QUEUE_URL);
        const channel = await connection.createChannel();
        await channel.assertExchange(EXCHANGE_NAME, "direct", { durable: true });
        return channel;
    } catch (err) {
        if (connection) {
            connection.close();
        }
        console.error("Failed to create channel:", err);
        throw err;
    }
};

/**
 * Publish a message to a specified service.
 * @param {amqplib.Channel} channel - The channel to use for publishing.
 * @param {string} service - The service to which the message is published.
 * @param {string} msg - The message to publish.
 */
module.exports.PublishMessage = (channel, service, msg) => {
    try {
        channel.publish(EXCHANGE_NAME, service, Buffer.from(msg));
        console.log("Sent:", msg);
    } catch (err) {
        console.error("Failed to publish message:", err);
    }
};

/**
 * Subscribe to messages from a specified service.
 * @param {amqplib.Channel} channel - The channel to use for subscribing.
 * @param {object} service - The service with a `SubscribeEvents` method to handle messages.
 */
module.exports.SubscribeMessage = async (channel, service) => {
    try {
        const queue = await channel.assertQueue(QUEUE_NAME);
        channel.bindQueue(queue.queue, EXCHANGE_NAME, CUSTOMER_BINDING_KEY);

        channel.consume(
            queue.queue,
            (message) => {
                if (message !== null) {
                    const messageContent = message.content.toString();
                    console.log("Received message:", messageContent);
                    service.SubscribeEvents(messageContent);
                    channel.ack(message); // Acknowledge the message
                }
            });
    } catch (error) {
        console.error("Failed to subscribe to messages:", error);
    }
};

