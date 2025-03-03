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
  MONGO_TEST_URI,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_API_KEY,
  CLOUDINARY_FOLDER_NAME,
  KAFKA_URL,
} = process.env;
