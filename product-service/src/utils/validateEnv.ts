import { cleanEnv, port, str, url } from 'envalid';

export const ValidateEnv = () => {
  cleanEnv(process.env, {
    NODE_ENV: str(),
    PORT: port(),
    MONGO_URI: url(),
    CLOUDINARY_CLOUD_NAME: str(),
    CLOUDINARY_API_SECRET: str(),
    CLOUDINARY_API_KEY: str(),
    CLOUDINARY_FOLDER_NAME: str(),
  });
};
