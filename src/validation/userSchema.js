import { z } from "zod";

export const addUserSchema = z
  .object({
    name: z
      .string()
      .min(1, "Name is required.")
      .transform((v) => v.trim()),

    email: z
      .string()
      .transform(v => v.trim())
      .optional()
      .refine(
        v => !v || z.string().email().safeParse(v).success,
        { message: "Invalid email address." }
      ),

    user_name: z
      .string()
      .min(1, "Username is required.")
      .min(3, "Username must be at least 3 characters")
      .max(16, "Username must be at most 16 characters")
      .regex(
        /^[A-Za-z][A-Za-z0-9_]*$/,
        "Username must start with a letter and can contain letters, numbers, and underscores"
      ),

    role_id: z.preprocess((val) => (val === null ? undefined : val),z.number({ required_error: "Please select role." }).min(1, "Please select role.")),

    profile_image: z
      .any()
      .optional()
      .refine(
        (files) => {
          if (!files || files.length === 0) return true;
          if (files.length !== 1) return false;
          const file = files[0];
          return file && file.type.startsWith("image/");
        },
        {
          message: "Only image files are allowed.",
        }
      ),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters long.")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
      .regex(/[0-9]/, "Password must contain at least one number.")
      .regex(
        /[@$!%*?&#]/,
        "Password must include at least one special character."
      ),

    confirm_password: z.string().min(1, "Please confirm your password."),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match.",
    path: ["confirm_password"],
  });

export const updateUserSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required.")
    .transform((v) => v.trim()),
  // email: z
  //   .string()
  //   .min(1, "Email is required.")
  //   .email("Invalid email address.")
  //   .transform((v) => v.trim()),
  email: z
  .string()
  .transform(v => v.trim())
  .optional()
  .refine(
    v => !v || z.string().email().safeParse(v).success,
    { message: "Invalid email address." }
  ),


  user_name: z
    .string()
    .min(1, "Username is required.")
    .min(3, "Username must be at least 3 characters")
    .max(16, "Username must be at most 16 characters")
    .regex(
      /^[A-Za-z][A-Za-z0-9_]*$/,
      "Username must start with a letter and can contain letters, numbers, and underscores"
    ),

  role_id: z.preprocess(
    (val) => (val === null ? undefined : val),
    z
      .number({ required_error: "Please select role." })
      .min(1, "Please select role.")
  ),
  profile_image: z
    .any()
    .optional()
    .refine(
      (files) => {
        if (!files || files.length === 0) return true;
        if (files.length !== 1) return false;
        const file = files[0];
        return file && file.type.startsWith("image/");
      },
      {
        message: "Only image files are allowed.",
      }
    ),
});

export const changeUserPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long.")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
      .regex(/[0-9]/, "Password must contain at least one number.")
      .regex(
        /[@$!%*?&#]/,
        "Password must include at least one special character."
      ),

    confirmNewPassword: z.string().min(1, "Please confirm your password."),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match.",
    path: ["confirmNewPassword"],
  });