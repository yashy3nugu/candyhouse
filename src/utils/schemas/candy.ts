import { z } from "zod";

export const candySchema = z.object({
  name: z.string(),
  description: z.string(),
  price: z.number(),
  quantity: z.number(),
  photo: z.object({
    url: z.string(),
    publicId: z.string(),
  }),
});

export default candySchema;
