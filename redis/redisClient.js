const {createClient} = require('redis');
require('dotenv').config();

// Create Redis Client
const redisClient = createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    }
});


// Handle connection and errors
redisClient.on('connect', () => {
    console.log('Redis client connected');
});

// Connect to Redis
(async () => {
    try {
        await redisClient.connect();
    } catch (err) {
        console.error('Redis client connection error', err);
    }
})();

module.exports = {
    redisClient
}
