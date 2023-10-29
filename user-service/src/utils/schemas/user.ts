import { z } from "zod";
import { Role } from "../types/user";

export const loginInputSchema = z.object({
  email: z
    .string({ required_error: "Please provide your email address" })
    .email({ message: "Please provide a valid email address" }),
  password: z.string({
    required_error: "Please provide your password",
  }),
});

export const registerInputSchema = z.object({
  email: z
    .string({ required_error: "user must provide their email" })
    .email({ message: "please provide a valid email" }),
  password: z
    .string({ required_error: "user must provide a password" })
    .min(6, "password must contain atleast 6 characters"),
  confirmPassword: z
    .string({ required_error: "user must confirm their password" })
    .min(6),

  name: z.string({ required_error: "user must provide their name" }),
  role: z.enum([Role.Admin, Role.Vendor, Role.User]),
});

export const registerFormSchema = registerInputSchema.refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  }
);
