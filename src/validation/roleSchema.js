import { z } from "zod";

export const addRoleSchema = z.object({
  name: z
    .string({
      required_error: "Role name is required",
    })
    .min(1, "Role name is required")
    .min(2, "Role name must be at least 2 characters")
    .max(100, "Role name is too long")
    .trim(),

  permission_ids: z
    .array(
      z
        .string()
        .nonempty()
        .transform((val) => Number(val))
        .refine((n) => Number.isInteger(n) && n > 0, {
          message: "Invalid permission id",
        })
    )
    .nonempty({ message: "Select at least one permission" }) // ✅ required array
    .transform((arr) => Array.from(new Set(arr))), // ✅ remove duplicates
});