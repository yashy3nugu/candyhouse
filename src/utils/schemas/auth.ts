import { z } from "zod";

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
  name: z.string({ required_error: "user must provide their name" }),
  role: z.string().optional()
});

// export const registerFormSchema = registerInputSchema.refine(
//   (data) => data.password === data.passwordConfirm,
//   {
//     message: "Passwords do not match",
//     path: ["passwordConfirm"],
//   }
// );