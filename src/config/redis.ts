import { createClient } from 'redis';
import dotenv from 'dotenv';
import { logger } from '@config/logger';

dotenv.config();

const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.on('error', (err) => {
  logger.error(`Redis Client Error: ${err.message}`); // Log Redis client errors
});

redisClient.on('connect', () => {
  logger.info('Redis connected successfully'); // Log successful Redis connection
});

redisClient.on('ready', () => {
  logger.info('Redis is ready to use'); // Log when Redis is ready
});

redisClient.on('end', () => {
  logger.info('Redis connection closed'); // Log when Redis connection is closed
});

(async () => {
  try {
    await redisClient.connect();
  } catch (err:any) {
    logger.error(`Failed to connect to Redis: ${err.message}`); // Log connection errors
  }
})();

export default redisClient;
