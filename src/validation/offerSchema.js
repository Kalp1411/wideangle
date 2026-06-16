import { z } from "zod";

export const offerSchema = z
  .object({
    offer_name: z.string().min(1, "Name is required."),
    mode: z.string().min(1, "Mode is required."),
    coupon_code: z.string().min(1, "Code is required."),
    offer_type: z.string().min(1, "Offer type is required."),
    status: z.string().min(1, "Status is required."),
    start_date: z.string().min(1, "Start date is required."),
    end_date: z.string().min(1, "End date is required."),
    amount: z.preprocess((val) => {
      if (val === "" || val === null || val === undefined) return undefined;
      const num = Number(val);
      return isNaN(num) ? val : num;
    }, z.number({
      invalid_type_error: "Amount must be a valid number.",
    }).optional()),

    percentage: z.preprocess((val) => {
      if (val === "" || val === null || val === undefined) return undefined;
      const num = Number(val);
      return isNaN(num) ? val : num;
    }, z.number({
      invalid_type_error: "Percentage must be a valid number.",
    }).optional()),
  })
  .superRefine((data, ctx) => {
    const start = new Date(data.start_date);
    const end = new Date(data.end_date);

    if (end <= start) {
      ctx.addIssue({
        path: ["end_date"],
        code: z.ZodIssueCode.custom,
        message: "End date must be after start date.",
      });
    }

    if (data.offer_type === "Flat") {
      if (data.amount === undefined || typeof data.amount !== "number" || isNaN(data.amount)) {
        ctx.addIssue({
          path: ["amount"],
          code: z.ZodIssueCode.custom,
          message: "Amount is required.",
        });
      }
    } else {
        if (data.percentage === undefined || typeof data.percentage !== "number" || isNaN(data.percentage)) {
        ctx.addIssue({
          path: ["percentage"],
          code: z.ZodIssueCode.custom,
          message: "Percentage is required.",
        });
      }
    }
  });




  export const offerUpdateSchema = z
  .object({
    offer_name: z.string().min(1, "Name is required"),
    mode: z.string().min(1, "Mode is required"),
    coupon_code: z.string().min(1, "Code is required"),
    offer_type: z.string().min(1, "Offer type is required"),
    status: z.string().min(1, "Status is required"),
    start_date: z.string().min(1, "Start date is required"),
    end_date: z.string().min(1, "End date is required"),

    amount: z.preprocess((val) => {
      if (val === "" || val === null || val === undefined) return undefined;
      const num = Number(val);
      return isNaN(num) ? val : num;
    }, z.number({
      invalid_type_error: "Amount must be a valid number",
    }).optional()),

    percentage: z.preprocess((val) => {
      if (val === "" || val === null || val === undefined) return undefined;
      const num = Number(val);
      return isNaN(num) ? val : num;
    }, z.number({
      invalid_type_error: "Percentage must be a valid number",
    }).optional()),

  })
  .superRefine((data, ctx) => {
    const start = new Date(data.start_date);
    const end = new Date(data.end_date);

    if (end <= start) {
      ctx.addIssue({
        path: ["end_date"],
        code: z.ZodIssueCode.custom,
        message: "End date must be after start date",
      });
    }

    if (data.offer_type === "Flat") {
      if (data.amount === undefined || typeof data.amount !== "number" || isNaN(data.amount)) {
        ctx.addIssue({
          path: ["amount"],
          code: z.ZodIssueCode.custom,
          message: "Amount is required.",
        });
      }
    } else {
        if (data.percentage === undefined || typeof data.percentage !== "number" || isNaN(data.percentage)) {
        ctx.addIssue({
          path: ["percentage"],
          code: z.ZodIssueCode.custom,
          message: "Percentage is required.",
        });
      }
    }
  });