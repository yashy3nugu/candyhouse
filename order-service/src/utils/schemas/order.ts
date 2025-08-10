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
  address: z.string({ required_error: 'Address Required' }),
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

export const orderConfirmSchema = z.object({
  paymentIntentId: z.string({ required_error: 'Payment Intent ID required' }),
  items: z
    .object({
      itemsInCart: z.number().min(1),
      // Accept either appId (from frontend cart) or candy (backend format)
      appId: z.string().optional(),
      candy: z.string().optional(),
      photo: z.object({
        url: z.string(),
      }),
      description: z.string(),
      quantity: z.number(),
      price: z.number(),
      name: z.string(),
    })
    .refine(data => data.appId || data.candy, {
      message: 'Either appId or candy field is required',
    })
    .array(),
  address: z.string({ required_error: 'Address Required' }),
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
