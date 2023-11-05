import { config } from 'dotenv';
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const {
  NODE_ENV,
  PORT,
  SECRET_KEY,
  LOG_FORMAT,
  LOG_DIR,
  ORIGIN,
  MONGO_URI,
  UPSTASH_KAFKA_PASSWORD,
  UPSTASH_KAFKA_URL,
  UPSTASH_KAFKA_USERNAME,
} = process.env;
