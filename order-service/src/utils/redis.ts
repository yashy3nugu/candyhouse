import { createClient } from 'redis';
import { logger } from './logger';

const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST || 'candyhouse-redis-master',
    port: parseInt(process.env.REDIS_PORT || '6379'),
  },
  password: process.env.REDIS_PASSWORD || 'your-redis-password',
  sentinels: [
    {
      host: process.env.REDIS_SENTINEL_1 || 'candyhouse-redis-sentinel-0.candyhouse-redis-headless',
      port: parseInt(process.env.REDIS_SENTINEL_PORT || '26379'),
    },
    {
      host: process.env.REDIS_SENTINEL_2 || 'candyhouse-redis-sentinel-1.candyhouse-redis-headless',
      port: parseInt(process.env.REDIS_SENTINEL_PORT || '26379'),
    },
  ],
  name: 'mymaster',
});

redisClient.on('error', (err) => {
  logger.error('Redis Client Error:', err);
});

redisClient.on('connect', () => {
  logger.info('Redis Client Connected');
});

redisClient.on('reconnecting', () => {
  logger.info('Redis Client Reconnecting');
});

export const connectRedis = async () => {
  try {
    await redisClient.connect();
    logger.info('Redis Client Connected Successfully');
  } catch (error) {
    logger.error('Redis Client Connection Error:', error);
    throw error;
  }
};

export const getRedisClient = () => redisClient;

export const setCache = async (key: string, value: any, ttl?: number) => {
  try {
    const stringValue = JSON.stringify(value);
    if (ttl) {
      await redisClient.setEx(key, ttl, stringValue);
    } else {
      await redisClient.set(key, stringValue);
    }
    return true;
  } catch (error) {
    logger.error('Redis Set Cache Error:', error);
    return false;
  }
};

export const getCache = async (key: string) => {
  try {
    const value = await redisClient.get(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    logger.error('Redis Get Cache Error:', error);
    return null;
  }
};

export const deleteCache = async (key: string) => {
  try {
    await redisClient.del(key);
    return true;
  } catch (error) {
    logger.error('Redis Delete Cache Error:', error);
    return false;
  }
}; 