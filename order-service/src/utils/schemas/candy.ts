import { z } from 'zod';
import { userSchema } from './user';
export const candySchema = z.object({
  name: z.string(),
  description: z.string(),
  price: z.number(),
  quantity: z.number(),
  photo: z.object({
    url: z.string(),
    publicId: z.string(),
  }),
  appId: z.string(),
  vendor: z.string(),
});
