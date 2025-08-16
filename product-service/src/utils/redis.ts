import { createClient } from 'redis';

// Environment-aware Redis configuration
const isProduction = process.env.NODE_ENV === 'production';
const useSentinel = process.env.REDIS_USE_SENTINEL === 'true' || isProduction;

const redisClient = createClient(
  useSentinel
    ? {
        // Production: Redis Sentinel configuration
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
        password: process.env.REDIS_PASSWORD,
      }
    : {
        // Development: Direct Redis connection
        socket: {
          host: process.env.REDIS_HOST || 'localhost',
          port: parseInt(process.env.REDIS_PORT || '6379'),
        },
        password: process.env.REDIS_PASSWORD || 'dev-redis-password',
      }
);

redisClient.on('error', (err) => console.error('Redis Client Error:', err));
redisClient.on('connect', () => console.log('Redis Client Connected'));
redisClient.on('reconnecting', () => console.log('Redis Client Reconnecting'));

export const connectRedis = async () => {
  try {
    await redisClient.connect();
    const connectionType = useSentinel ? 'Redis Sentinel' : 'Redis Direct';
    console.log(`✅ Connected to ${connectionType}`);
    
    // Configure memory policy for better cache management
    await redisClient.configSet('maxmemory-policy', 'allkeys-lru');
    console.log('📊 Configured Redis eviction policy to allkeys-lru');
  } catch (error) {
    console.error('❌ Error connecting to Redis:', error);
    throw error;
  }
};

export const getCache = async (key: string) => {
  try {
    const cached = await redisClient.get(key);
    return cached ? JSON.parse(cached) : null;
  } catch (error) {
    console.error('Error getting cache:', error);
    return null;
  }
};

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
    console.error('Error setting cache:', error);
    return false;
  }
};

export const deleteCache = async (key: string) => {
  try {
    await redisClient.del(key);
    return true;
  } catch (error) {
    console.error('Error deleting cache:', error);
    return false;
  }
};

export const incrementCacheCounter = async (key: string, ttl?: number): Promise<number> => {
  try {
    const newCount = await redisClient.incr(key);
    if (ttl) {
      await redisClient.expire(key, ttl);
    }
    return newCount;
  } catch (error) {
    console.error('Error incrementing cache counter:', error);
    return 0;
  }
}; 