import { changeDateFormat } from "@/utils/helper";
import { z } from "zod";

export const addStarCastSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required.")
    .transform((val) => (typeof val === "string" ? val.trim() : val)),

  dateofbirth: z.preprocess(
    (val) => {
      if (val instanceof Date && !isNaN(val.getTime())) {
        return changeDateFormat(val, "yyyy-MM-dd");
      }
      if (typeof val === "string") {
        return val;
      }
      return "";
    },
    z
      .string()
      .min(1, "Birth date is required.")
      .refine((val) => !isNaN(Date.parse(val)), "Invalid date format.")
      .transform((val) => (typeof val === "string" ? val.trim() : val))
  ),

  gender: z
    .string({
      required_error: "Please select gender.",
    })
    .min(1, "Please select gender."),

  role_id: z
    .number({
      required_error: "Please select role.",
    })
    .min(1, "Please select role."),

  image: z.any().refine((files) => files?.length === 1, {
    message: "Image is required.",
  }),

  biography: z
    .union([z.string(), z.literal(""), z.null()])
    .optional()
    .transform((val) => (typeof val === "string" ? val.trim() : val)),
});

export const updateStarCastSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required.")
    .transform((val) => (typeof val === "string" ? val.trim() : val)),

  dateofbirth: z.preprocess(
    (val) => {
      if (val instanceof Date && !isNaN(val.getTime())) {
        return changeDateFormat(val, "yyyy-MM-dd");
      }
      if (typeof val === "string") {
        return val;
      }
      return "";
    },
    z
      .string()
      .min(1, "Birth date is required.")
      .refine((val) => !isNaN(Date.parse(val)), "Invalid date format.")
      .transform((val) => (typeof val === "string" ? val.trim() : val))
  ),

  gender: z
    .string({
      required_error: "Please select gender.",
    })
    .min(1, "Please select gender."),

  role_id: z
    .number({
      required_error: "Please select role.",
    })
    .min(1, "Please select role."),

  // 🔹 Make image optional
  image: z.any().optional(),

  biography: z
    .union([z.string(), z.literal(""), z.null()])
    .optional()
    .transform((val) => (typeof val === "string" ? val.trim() : val)),
});
