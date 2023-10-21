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

export const candyUpdateSchema = z.object({
  _id: z.string().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  price: z.number().optional(),
  quantity: z.number().optional(),
  photo: z
    .object({
      url: z.string().optional(),
      publicId: z.string().optional(),
    })
    .optional(),
});


export default candySchema;
