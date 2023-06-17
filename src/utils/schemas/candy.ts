import { z } from "zod";

export const candySchema = z.object({
  name: z.string(),
  description: z.string(),
  price: z.number(),
  quantity: z.number(),
});

export default candySchema;
