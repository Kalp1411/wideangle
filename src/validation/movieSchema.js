import { changeDateFormat } from "@/utils/helper";
import { z } from "zod";

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
const videoExtensions = ["mp4", "mov", "avi", "mkv"];
const imgExtensions = ["jpg", "jpeg", "png", "webp"];

const isYoutubeUrl = (val) =>
  /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]{11}(&.*)?$/.test(
    val
  );

  const getImageDimensions = (file) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.width, height: img.height });
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });

const requiredYoutubeUrlSchema = z
  .string()
  .min(1, { message: "This URL is required." })
  .url({ message: "Invalid URL format." })
  .refine(isYoutubeUrl, {
    message:
      "Invalid YouTube URL. Example: https://www.youtube.com/watch?v=abcd1234",
  })
  .transform((val) => typeof val === "string" ? val.trim() : val);

const optionalYoutubeUrlSchema = z
  .union([
    z.string().optional(),
    z.literal(""),
    z.null()
  ])
  .transform((val) => {
    if (!val || val === "" || val === null) return null;
    return typeof val === "string" ? val.trim() : val;
  })
  .refine(
    (val) => val === null || requiredYoutubeUrlSchema.safeParse(val).success,
    {
      message:
        "Invalid YouTube URL. Example: https://www.youtube.com/watch?v=abcd1234",
    }
  );

export const addMovieSchema = z.object({
  movie_name: z
    .string()
    .min(1, "Movie name is required.")
    .transform((val) => typeof val === "string" ? val.trim() : val),

  distributor_id: z
    .number({
      required_error: "Please select distributor.",
    })
    .min(1, "Please select distributor."),

  start_date: z.preprocess(
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
      .min(1, "Start date is required.")
      .refine((val) => !isNaN(Date.parse(val)), "Invalid date format.")
      .transform((val) => typeof val === "string" ? val.trim() : val)
  ),

  end_date: z.preprocess(
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
      .min(1, "End date is required.")
      .refine((val) => !isNaN(Date.parse(val)), "Invalid date format.")
      .transform((val) => typeof val === "string" ? val.trim() : val)
  ),

  interval_time: z
    .string()
    .min(1, "Interval duration is required.")
    .regex(timeRegex, {
      message: "Time must be in HH:MM format (00:00 - 23:59).",
    })
    .transform((val) => typeof val === "string" ? val.trim() : val),

  run: z
    .string()
    .min(1, "Run is required")
    .refine((val) => !isNaN(Number(val)), { message: "Run must be a number." })
    .transform((val) => typeof val === "string" ? val.trim() : val),

  tax_id: z
    .string()
    .min(1, "Please select a tax option.")
    .transform((val) => typeof val === "string" ? val.trim() : val),

  rating_id: z
    .number({
      required_error: "Please select rating.",
    })
    .min(1, "Please select rating."),

  movie_type_ids: z.preprocess((val) => {
    if (Array.isArray(val)) return val;
    if (typeof val === "string") return [val];
    return [];
  }, z.array(z.number()).min(1, "Please select movie type.")),

glass_charge_3d: z
  .preprocess((val) => {
    if (val === "") return undefined;
    if (typeof val === "string") return Number(val);
    return val;
  }, 
  z.number({
      invalid_type_error: "3D Glass price must be a number"
    })
    .nonnegative("3D Glass price cannot be negative")
    .optional()
  ),

  category_ids: z.preprocess((val) => {
    if (Array.isArray(val)) return val;
    if (typeof val === "string") return [val];
    return [];
  }, z.array(z.number()).min(1, "Please select category.")),

  first_halfduration: z
    .string()
    .min(1, "Please enter first half duration.")
    .regex(timeRegex, {
      message: "Time must be in HH:MM format (00:00 - 23:59).",
    })
    .transform((val) => typeof val === "string" ? val.trim() : val),

  second_halfduration: z
    .string()
    .min(1, "Please enter second half duration.")
    .regex(timeRegex, {
      message: "Time must be in HH:MM format (00:00 - 23:59).",
    })
    .transform((val) => typeof val === "string" ? val.trim() : val),

  language_ids: z.preprocess((val) => {
    if (Array.isArray(val)) return val;
    if (typeof val === "string") return [val];
    return [];
  }, z.array(z.number()).min(1, "Please select language.")),

  // postar_image: z.any().refine((files) => files?.length === 1, {
  //   message: "Image is required.",
  // }),

  postar_image: z
  .any()
  .refine((files) => files && files.length === 1, {
    message: "Image is required",
  })
  .refine((files) => {
    const file = files?.[0];
    if (!file) return false;

    const ext = file.name?.split(".").pop()?.toLowerCase();
    return imgExtensions.includes(ext);
  }, {
    message: "Only JPG, JPEG, PNG, or WEBP images are allowed",
  }),

  trailer_url: requiredYoutubeUrlSchema,
  teaser_url: optionalYoutubeUrlSchema,

  cast_ids: z.preprocess((val) => {
    if (Array.isArray(val)) return val;
    if (typeof val === "string") return [val];
    return [];
  }, z.array(z.number()).min(1, "Select at least one star cast.")),

  description: z
    .union([z.string(), z.literal(""), z.null()])
    .optional()
    .transform((val) => typeof val === "string" ? val.trim() : val),
}).refine((data) => {
    if (data.movie_type_ids.includes(2)) {
      return typeof data.glass_charge_3d === "number" && !isNaN(data.glass_charge_3d);
    }
    return true;
  }, {
    message: "Please enter 3D Glass price",
    path: ["glass_charge_3d"],
  });

export const editMovieSchema = z.object({
  movie_name: z
    .string()
    .min(1, "Movie name is required.")
    .transform((val) => typeof val === "string" ? val.trim() : val),

  distributor_id: z
    .number({
      required_error: "Please select distributor.",
    })
    .min(1, "Please select distributor."),

  start_date: z.preprocess(
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
      .min(1, "Start date is required.")
      .refine((val) => !isNaN(Date.parse(val)), "Invalid date format.")
      .transform((val) => typeof val === "string" ? val.trim() : val)
  ),

  end_date: z.preprocess(
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
      .min(1, "End date is required.")
      .refine((val) => !isNaN(Date.parse(val)), "Invalid date format.")
      .transform((val) => typeof val === "string" ? val.trim() : val)
  ),

  interval_time: z
    .string()
    .min(1, "Interval duration is required.")
    .regex(timeRegex, {
      message: "Time must be in HH:MM format (00:00 - 23:59).",
    })
    .transform((val) => typeof val === "string" ? val.trim() : val),

  run: z
    .string()
    .min(1, "Run is required")
    .refine((val) => !isNaN(Number(val)), { message: "Run must be a number." })
    .transform((val) => typeof val === "string" ? val.trim() : val),

  tax_id: z
    .string()
    .min(1, "Please select a tax option.")
    .transform((val) => typeof val === "string" ? val.trim() : val),

    glass_charge_3d: z
  .preprocess((val) => {
    if (val === "") return undefined;
    if (typeof val === "string") return Number(val);
    return val;
  }, 
  z.number({
      invalid_type_error: "3D Glass price must be a number"
    })
    .nonnegative("3D Glass price cannot be negative")
    .optional()
  ),

  rating_id: z
    .number({
      required_error: "Please select rating.",
    })
    .min(1, "Please select rating."),

  movie_type_ids: z.preprocess((val) => {
    if (Array.isArray(val)) return val;
    if (typeof val === "string") return [val];
    return [];
  }, z.array(z.number()).min(1, "Please select movie type.")),

  category_ids: z.preprocess((val) => {
    if (Array.isArray(val)) return val;
    if (typeof val === "string") return [val];
    return [];
  }, z.array(z.number()).min(1, "Please select category.")),

  first_halfduration: z
    .string()
    .min(1, "Please enter first half duration.")
    .regex(timeRegex, {
      message: "Time must be in HH:MM format (00:00 - 23:59).",
    })
    .transform((val) => typeof val === "string" ? val.trim() : val),

  second_halfduration: z
    .string()
    .min(1, "Please enter second half duration.")
    .regex(timeRegex, {
      message: "Time must be in HH:MM format (00:00 - 23:59).",
    })
    .transform((val) => typeof val === "string" ? val.trim() : val),

  language_ids: z.preprocess((val) => {
    if (Array.isArray(val)) return val;
    if (typeof val === "string") return [val];
    return [];
  }, z.array(z.number()).min(1, "Please select language.")),

  // postar_image: z
  //   .any()
  //   .optional()
  //   .refine(
  //     (files) => {
  //       if (!files || files.length === 0) return true;
  //       return files.length === 1;
  //     },
  //     {
  //       message: "Only one image file allowed.",
  //     }
  //   ),

  postar_image: z
  .any()
  .optional()
  .refine((files) => {
    if (!files || files.length === 0) return true;

    return files.length === 1;
  }, {
    message: "Only one image is allowed",
  })
  .refine((files) => {
    if (!files || files.length === 0) return true;

    const file = files[0];
    const ext = file.name?.split(".").pop()?.toLowerCase();

    return imgExtensions.includes(ext);
  }, {
    message: "Only JPG, JPEG, PNG, or WEBP images are allowed",
  }),

  trailer_url: requiredYoutubeUrlSchema,
  teaser_url: optionalYoutubeUrlSchema,

  cast_ids: z.preprocess((val) => {
    if (Array.isArray(val)) return val;
    if (typeof val === "string") return [val];
    return [];
  }, z.array(z.number()).min(1, "Select at least one star cast.")),

  description: z
    .union([z.string(), z.literal(""), z.null()])
    .optional()
    .transform((val) => typeof val === "string" ? val.trim() : val),

      tax_id: z
      .union([z.string(), z.number()])
      .optional()
      .transform((val) => typeof val === "string" ? val.trim() : val),

    tax_update_date: z.preprocess(
      (val) => {
        if (val instanceof Date && !isNaN(val.getTime())) {
          return changeDateFormat(val, "yyyy-MM-dd");
        }
        if (typeof val === "string") {
          return val;
        }
        return null;
      },
      z
        .string()
        .nullable()
        .optional()
        .transform((val) => typeof val === "string" ? val.trim() : val)
    ),

    showTaxes: z.boolean().optional(),
  })
  .refine((data) => {
    if (data.movie_type_ids.includes(2)) {
      return typeof data.glass_charge_3d === "number" && !isNaN(data.glass_charge_3d);
    }
    return true;
  }, {
    message: "Please enter 3D Glass price",
    path: ["glass_charge_3d"],
  })
  .superRefine((data, ctx) => {
    if (data.showTaxes) {
      if (!data.tax_id) {
        ctx.addIssue({
          path: ["tax_id"],
          code: z.ZodIssueCode.custom,
          message: "Please select a tax.",
        });
      }
      if (!data.tax_update_date) {
        ctx.addIssue({
          path: ["tax_update_date"],
          code: z.ZodIssueCode.custom,
          message: "Effective date is required when tax is changed.",
        });
      }
    }
  });