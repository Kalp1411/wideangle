import { z } from "zod";

export const addFoodItemSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required.")
    .transform((val) => val.trim()),

  weight: z
    .string()
    .min(1, "Weight is required.")
    .transform((val) => val.trim()),  

gst_slab: z
  .coerce.number({ invalid_type_error: "GST slab must be a number" })
  .positive({ message: "GST slab must be greater than 0" })
  .min(1, { message: "GST slab is required and must be at least 1" })
  .refine((n) => {
    const multiplied = n * 100;
    return Number.isInteger(multiplied);
  }, { message: "GST slab can have at most 2 decimal places" })
  .refine((n) => [5, 12, 18, 28].includes(Math.round(n)), {
    message: "Common GST rates: 5%, 12%, 18%, 28%",
  }),
  price: z.coerce
    .number({
      required_error: "Price is required.",
      invalid_type_error: "Price must be a valid number.",
    })
    .gt(0, "Price must be greater than 0."),

  image: z.any().refine((files) => files?.length === 1, {
    message: "Image is required.",
  }),
  recipe_id: z.preprocess(
    (val) => (val === null ? undefined : val),
    z
      .number({ required_error: "Please select recipe." })
      .min(1, "Please select recipe."),
  ),
});

export const updateFoodItemSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required.")
    .transform((val) => val.trim()),

     weight: z
    .string()
    .min(1, "Weight is required.")
    .transform((val) => val.trim()),  

gst_slab: z
  .coerce.number({ invalid_type_error: "GST slab must be a number" })
  .positive({ message: "GST slab must be greater than 0" })
  .min(1, { message: "GST slab is required and must be at least 1" })
  .refine((n) => {
    const multiplied = n * 100;
    return Number.isInteger(multiplied);
  }, { message: "GST slab can have at most 2 decimal places" })
  .refine((n) => [5, 12, 18, 28].includes(Math.round(n)), {
    message: "Common GST rates: 5%, 12%, 18%, 28%",
  }),
  price: z.coerce
    .number({
      required_error: "Price is required.",
      invalid_type_error: "Price must be a valid number.",
    })
    .gt(0, "Price must be greater than 0."),

  image: z.any().optional(),
  recipe_id: z.preprocess(
    (val) => (val === null ? undefined : val),
    z
      .number({ required_error: "Please select recipe." })
      .min(1, "Please select recipe."),
  ),
});

export const addFoodComboSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required.")
    .transform((val) => val.trim()),

    weight: z
    .string()
    .min(1, "Weight is required.")
    .transform((val) => val.trim()), 

  price: z.coerce
    .number({
      required_error: "Price is required.",
      invalid_type_error: "Price must be a valid number.",
    })
    .gt(0, "Price must be greater than 0."),

  image: z.any().refine((files) => files?.length === 1, {
    message: "Image is required.",
  }),

  fooditems: z.preprocess(
    (val) => {
      if (Array.isArray(val)) return val;
      if (typeof val === "string") return [val];
      return [];
    },
    z.array(z.number()).min(1, "Select at least one item."),
  ),
});

export const updateFoodComboSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required.")
    .transform((val) => val.trim()),
weight: z
    .string()
    .min(1, "Weight is required.")
    .transform((val) => val.trim()), 


  price: z.coerce
    .number({
      required_error: "Price is required.",
      invalid_type_error: "Price must be a valid number.",
    })
    .gt(0, "Price must be greater than 0."),

  image: z.any().optional(),
  fooditems: z.preprocess(
    (val) => {
      if (Array.isArray(val)) return val;
      if (typeof val === "string") return [val];
      return [];
    },
    z.array(z.number()).min(1, "Select at least one item."),
  ),
});