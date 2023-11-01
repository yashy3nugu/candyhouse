import { App } from '@/app';
import { AuthRoute } from '@routes/auth.route';
import { UserRoute } from '@routes/users.route';
import { ValidateEnv } from '@utils/validateEnv';
import { OrderRoute } from './routes/order.route';
import { connectDB } from './lib/mongoose';
import { MONGO_URI } from './config';

const start = async () => {
  ValidateEnv();
  await connectDB(MONGO_URI);

  const app = new App([new OrderRoute()]);

  app.listen();
};

start();
