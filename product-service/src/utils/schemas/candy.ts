import { z } from 'zod';

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

export const paginatedCandyFetchSchema = z.object({
  page: z
    .string()
    .refine(val => !isNaN(parseInt(val)))
    .nullish(),
  limit: z
    .string()
    .refine(val => !isNaN(parseInt(val)))
    .nullish(),
});

export const candyByIdSchema = z.object({
  id: z.string({ required_error: 'Candy Id required' }),
});

export const candyQuantityUpdateSchema = z.object({
  quantity: z.number(),
});
