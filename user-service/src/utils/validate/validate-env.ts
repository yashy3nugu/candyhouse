import { cleanEnv, port, str, url, num } from "envalid";

export const ValidateEnv = () => {
  cleanEnv(process.env, {
    NODE_ENV: str(),
    PORT: port(),
    MONGO_URI: url(),
    JWT_SECRET: str(),
    JWT_EXPIRES_IN: num(),
    KAFKA_URL: url(),
  });
};
