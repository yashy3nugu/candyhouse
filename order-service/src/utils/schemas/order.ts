import { z } from 'zod';
import { Status } from '../types/order';
const itemSchema = z.object({
  itemsInCart: z.number().min(1),
  candy: z.string({ required_error: 'Candy id required' }),
  photo: z.object({
    url: z.string(),
  }),
  description: z.string(),
  quantity: z.number(),
  price: z.number(),
  name: z.string(),
});

export const orderInputSchema = z.object({
  items: z
    .object({
      itemsInCart: z.number().min(1),
      candy: z.string({ required_error: 'Candy id required' }),
      photo: z.object({
        url: z.string(),
      }),
      description: z.string(),
      quantity: z.number(),
      price: z.number(),
      name: z.string(),
    })
    .array(),
  code: z.string().max(6).min(6).optional(),
  coinsToRedeem: z.number().min(0).multipleOf(10).finite(),
  address: z.string({ required_error: 'Address Required' }),
  bank: z.string({ required_error: 'payment bank required' }),
});

export const paginatedOrderFetchSchema = z.object({
  page: z
    .string()
    .refine(val => !isNaN(parseInt(val)))
    .nullish(),
  limit: z
    .string()
    .refine(val => !isNaN(parseInt(val)))
    .nullish(),
});

export const orderByIdSchema = z.object({
  id: z.string({ required_error: 'Order Id required' }),
});

export const orderUpdateSchema = z.object({
  items: z
    .object({
      itemsInCart: z.number().min(1),
      candy: z.string({ required_error: 'Candy id required' }),
      photo: z.object({
        url: z.string(),
      }),
      description: z.string(),
      quantity: z.number(),
      price: z.number(),
      name: z.string(),
    })
    .array()
    .optional(),
  address: z.string({ required_error: 'Address Required' }).optional(),
  bank: z.string({ required_error: 'payment bank required' }).optional(),
  status: z.enum([Status.Cancelled, Status.Delivered, Status.Pending]).optional(),
});
