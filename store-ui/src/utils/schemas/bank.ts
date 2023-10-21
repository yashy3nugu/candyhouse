import { z } from "zod";
import { Status } from "../types/bank";

export const bankUpdateSchema = z.object({
  status: z.enum([Status.Down, Status.Running]),
  _id: z.string(),
});