import { z } from "zod";

const optionalString = () =>
  z.preprocess((val) => {
    if (val === "" || val === undefined) return null;
    return val;
  }, z.string().nullable().optional());

export const distributorSchema = z.object({
  name: z.string().min(1, "Name is required."),

  address: z.string()
  .trim()
  .pipe(
    z.string()
      .min(2, "Address must be at least 2 characters.")
      .max(100, "Address must be under 100 characters.")
      .optional()
  )
  .or(z.literal("")),

  // mobile_no: z.coerce
  //   .string()
  //   .min(10, "Mobile number must be between 10 to 12 digits.")
  //   .max(12, "Mobile number must be between 10 to 12 digits.")
  //   .regex(/^\d+$/, "Mobile number must contain only digits.")
  //   .transform((val) => Number(val)),

  // mobile_no: z
  // .string()
  // .optional()
  // .refine(
  //   (val) => {
  //     if (!val) return true;
  //     return /^\d{10,12}$/.test(val);
  //   },
  //   {
  //     message: "Mobile number must be 10–12 digits and contain only numbers",
  //   }
  // )
  // .transform((val) => (val ? Number(val) : undefined)),
  mobile_numbers: z
  .array(
    z.object({
      value: z
        .string()
        .refine(
          (v) => v === "" || /^\d{10}$/.test(v),
          "Mobile must be 10 digits"
        ),
    })
  )
  .optional(),

  referenced_by: optionalString(),

  city_id: z.coerce.string().min(1, "City is required."),

  state_id: z.coerce.string().min(1, "State is required."),

  pincode: z.string().min(1, "Pincode is required."),

  // email_id: z
  // .string()
  // .trim()
  // .min(1, "Email is required")
  // .email("Invalid email address"),

  emails: z
    .array(
      z.object({
        value: z
          .string()
          .min(1, "Email is required")
          .email("Invalid email format")
      })
    )
    .min(1, "At least one email required"),

});