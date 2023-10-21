import { z } from "zod";

export const reviewInputSchema = z.object({
    candy: z.string(),
    description: z.string(),
    rating: z.number(),
    title: z.string()
    
})