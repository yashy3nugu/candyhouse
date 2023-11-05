import { cleanEnv, port, str, url } from 'envalid';

export const ValidateEnv = () => {
  cleanEnv(process.env, {
    NODE_ENV: str(),
    PORT: port(),
    MONGO_URI: url(),
    UPSTASH_KAFKA_USERNAME: str(),
    UPSTASH_KAFKA_PASSWORD: str(),
    UPSTASH_KAFKA_URL: url(),
  });
};
