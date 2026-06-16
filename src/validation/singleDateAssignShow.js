import { z } from "zod";

/* ------------------------------
   Helpers
------------------------------ */

// convert string → number safely (supports decimals)
const toNumber = (val) => {
  if (val === "" || val === null || val === undefined) return undefined;

  const num = parseFloat(val);
  return isNaN(num) ? undefined : num;
};

// reusable number field (ids)
const numberField = (fieldName) =>
  z.preprocess(
    toNumber,
    z
      .number({
        required_error: `${fieldName} is required.`,
        invalid_type_error: `${fieldName} must be a number.`,
      })
      .min(1, `${fieldName} is required.`),
  );

/* ------------------------------
   Class Prices Schema
   supports: 10 | 10.25 | 99.99
------------------------------ */

const classPricesSchema = z.record(
  z
    .string()
    .min(1, { message: "Price is required." })
    .refine((val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num > 0;
    }, { message: "Price must be greater than 0." })
    .transform((val) => parseFloat(val)),
);

/* ------------------------------
   Final Schema
------------------------------ */

export const singleDateAssignShowSchema = z
  .object({
    /* ids */
    language_id: numberField("Language"),
    movie_type_id: numberField("Movie type"),
    screen_id: numberField("Screen"),
    show_id: numberField("Show"),

    /* time */
    start_time: z
      .string({
        required_error: "Show time is required.",
      })
      .min(1, "Show time is required."),

    /* class prices */
    class_prices: classPricesSchema,

    /* 3D glass charge (decimal safe) */
    glass_charge_3d: z
      .string()
      .optional()
      .transform((v) => parseFloat(v || 0)),
  })

  /* ------------------------------
     Conditional validation
  ------------------------------ */

  .superRefine((data, ctx) => {
    // if 3D movie -> glass charge required
    if (data.movie_type_id === 2 && (!data.glass_charge_3d || data.glass_charge_3d <= 0)) {
      ctx.addIssue({
        path: ["glass_charge_3d"],
        code: z.ZodIssueCode.custom,
        message: "Glass charge is required.",
      });
    }
  });
