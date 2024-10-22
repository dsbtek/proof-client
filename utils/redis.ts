// import Redis from 'ioredis';

// const redis = new Redis({
//     host: process.env.REDIS_HOST,
//     port: parseInt(process.env.REDIS_PORT || '6379'),
//     // password: process.env.REDIS_PASSWORD,
// });

// export default redis;

import { createClient } from 'redis';

const redis = createClient({
    password: process.env.NEXT_PUBLIC_PASSWORD,
    socket: {
        host: process.env.NEXT_PUBLIC_REDIS_HOST,
        port: parseInt(process.env.NEXT_PUBLIC_REDIS_PORT || '6379')
    }
});

// Handle connection errors
redis.on('error', (err) => console.error('Redis Client Error', err));

// Connect to Redis
(async () => {
    try {
        await redis.connect();
        console.log('Connected to Redis');
    } catch (err) {
        console.error('Error connecting to Redis:', err);
    }
})();

export default redis;
