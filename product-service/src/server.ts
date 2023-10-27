import { App } from '@/app';
import { ValidateEnv } from '@utils/validateEnv';
import { connectDB } from './lib/mongoose';
import { MONGO_URI } from './config';
import { CandyRoute } from './routes/candy.route';

const start = async () => {
  ValidateEnv();
  await connectDB(MONGO_URI);

  const app = new App([new CandyRoute()]);

  app.listen();
};

start();
