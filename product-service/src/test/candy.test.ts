import request from 'supertest';
import { App } from '@/app';
import { CandyRoute } from '@/routes/candy.route';
import { connectDB } from '@/lib/mongoose';
import CandyModel from '@/models/candy.model';
import { MONGO_TEST_URI } from '@/config';

beforeAll(async () => {
  await connectDB(MONGO_TEST_URI);
});

afterAll(async () => {
  await CandyModel.deleteMany({});
});

afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
});

describe('TEST Candy API', () => {
  const route = new CandyRoute();
  const app = new App([route]);

  describe('[GET] /candy', () => {
    it('response should have the Create candyData', () => {
      return request(app.getServer())
        .get('/candy')
        .query({
          page: 1,
          limit: 6,
        })
        .expect(200);
    });
  });
});
