import { z } from 'zod';
import { Role } from '@/utils/types/user';

export const userSchema = z.object({
  _id: z.string(),
  appId: z.string().uuid(),
  email: z.string({ required_error: 'user must provide their email' }).email({ message: 'please provide a valid email' }),
  name: z.string({ required_error: 'user must provide their name' }),
  role: z.enum([Role.Admin, Role.Vendor, Role.User]),
  balance: z.number().optional(),
  totalEarnedCoins: z.number().optional(),
  totalRedeemedCoins: z.number().optional(),
});
