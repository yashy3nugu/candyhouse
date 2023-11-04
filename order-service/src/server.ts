import { App } from '@/app';
import { ValidateEnv } from '@utils/validateEnv';
import { OrderRoute } from './routes/order.route';
import { connectDB } from './lib/mongoose';
import { MONGO_URI } from './config';
import { consumer } from './lib/kafka';
import { UserModel } from './models/user.model';
import { userSchema } from './utils/schemas/user';
import { candySchema } from './utils/schemas/candy';
import CandyModel from './models/candy.model';
import { BankRoute } from './routes/bank.route';

const start = async () => {
  ValidateEnv();
  console.log(MONGO_URI);
  await connectDB(MONGO_URI);

  await consumer.connect();
  await consumer.subscribe({ topics: ['user', 'candy', 'test'] });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      if (message.value) {
        if (topic === 'candy') {
          try {
            const recievedCandy = JSON.parse(message.value.toString());
            const { description, name, photo, price, quantity, appId, vendor } = candySchema.parse(recievedCandy);

            const vendorDocument = await UserModel.findOne({ appId: vendor });
            const foundCandy = await CandyModel.findOne({ appId });

            if (foundCandy) {
              await CandyModel.findOneAndUpdate({ appId }, { appId, photo, price, name, quantity, description, vendor: vendorDocument._id });
            } else {
              const createdCandy = await CandyModel.create({
                appId,
                photo,
                price,
                name,
                quantity,
                description,
                vendor: vendorDocument._id,
              });
              // console.log('created candu');
              // console.log(createdCandy);
            }
          } catch (err) {
            console.log(err);
          }
        } else {
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
      }
    },
  });

  const app = new App([new OrderRoute(), new BankRoute()]);

  app.listen();
};

start();
