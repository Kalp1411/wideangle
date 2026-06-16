import { z } from "zod";

export const loginSchema = z.object({
  // email: z.string().nonempty({ message: "Email is required." }).email({ message: "Enter a valid email address." }),
  user_name: z.string().nonempty({ message: "Username is required." }),
  password: z.string().nonempty({ message: "Password is required." }),
});

export const forgotPasswordSchema = z.object({
  email: z.string().nonempty({ message: "Email is required." }),
});

export const otpVerificationSchema = z.object({
  otp: z.string().nonempty({ message: "OTP is required." }),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters." })
      .nonempty({ message: "Password is required." }),
    confirm_password: z
      .string()
      .nonempty({ message: "Confirm Password is required." }),
  })
  .refine((data) => data.password === data.confirm_password, {
    path: ["confirm_password"],
    message: "Passwords do not match.",
  });