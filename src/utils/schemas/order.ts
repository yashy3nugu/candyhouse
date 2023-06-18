import { z } from "zod";
import { Status } from "@/utils/types/orders";

export const updateOrderStatusSchema = z.object({
  status: z.enum([Status.Delivered, Status.Pending, Status.Cancelled]),
  _id: z.string(),
});


const itemSchema = z.object({
  itemsInCart: z.number().min(1),
  candy: z.string({required_error: "Candy id required"}),
  
});

export const orderInputSchema = z.object({
  items: z.array(itemSchema),
  // price: z.number().min(1),
});