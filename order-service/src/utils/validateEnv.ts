import { cleanEnv, port, str, url } from 'envalid';

export const ValidateEnv = () => {
  cleanEnv(process.env, {
    NODE_ENV: str(),
    PORT: port(),
    MONGO_URI: url(),
  });
};
