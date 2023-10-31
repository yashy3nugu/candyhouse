import { App } from '@/app';
import { ValidateEnv } from '@utils/validateEnv';
import { connectDB } from './lib/mongoose';
import { MONGO_URI } from './config';
import { CandyRoute } from './routes/candy.route';
import { consumer } from './lib/kafka';
import { userSchema } from './utils/schemas/user';
import { UserModel } from './models/user.model';
import { ImageRoutes as ImageRoute } from './routes/image.route';

const start = async () => {
  ValidateEnv();
  await connectDB(MONGO_URI);

  await consumer.connect();
  await consumer.subscribe({ topic: 'test-topic' });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      if (message.value) {
        try {
          const recievedUser = JSON.parse(message.value.toString());
          const { appId, balance, email, name, role, totalEarnedCoins, totalRedeemedCoins } = userSchema.parse(recievedUser);
          const foundUser = await UserModel.findOne({ appId });

          if (foundUser) {
            await UserModel.findOneAndUpdate({ appId }, { balance, email, name, role, totalEarnedCoins, totalRedeemedCoins });
          } else {
            const createdUser = await UserModel.create({
              appId,
              balance,
              email,
              name,
              role,
              totalEarnedCoins,
              totalRedeemedCoins,
            });
          }
        } catch (err) {
          console.log(err);
        }
      }
    },
  });

  const app = new App([new CandyRoute(), new ImageRoute()]);

  app.listen();
};

start();
