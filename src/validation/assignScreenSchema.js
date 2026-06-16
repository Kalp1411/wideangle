import { z } from "zod";

// Show schema (inside a date)
const ShowSchema = z.object({
  show_id: z.preprocess(
    (val) => {
      if (typeof val === "string") return parseInt(val);
      if (typeof val === "number") return val;
      return val;
    },
    z.number().int().min(1, "Show is required")
  ),
  start_time: z.string().min(1, "Start time is required"),
class_prices: z.record(
  z.string(), // class_id as string
  z.preprocess(
    (val) => {
      // If val is a string, remove non-numeric characters (except decimal points if needed)
      if (typeof val === "string") {
        const cleaned = val.replace(/[^0-9.]/g, ""); // Keep digits and decimal point
        const num = Number(cleaned);
        return isNaN(num) ? null : num; // Return null if conversion fails
      }
      // If val is already a number, return it
      return typeof val === "number" && !isNaN(val) ? val : null;
    },
    z.number().nullable().refine((val) => val !== null && val >= 1, {
      message: "Price must be a valid number >= 1",
    })
  )
),
});

// Date schema (inside a screen assignment)
const DateSchema = z.object({
  date: z.string().min(1, "Date is required"),
  shows: z.array(ShowSchema).min(1, "At least one show is required"),
});

// Screen assignment schema
const ScreenAssignSchema = z.object({
  screen_id: z.preprocess(
    (val) => (typeof val === "string" ? parseInt(val) : val),
    z.number().int().min(1, "Screen is required")
  ),
  language_id: z.preprocess(
    (val) => (typeof val === "string" ? parseInt(val) : val),
    z.number().int().min(1, "Language is required")
  ),
  movie_type_id: z.preprocess(
    (val) => (typeof val === "string" ? parseInt(val) : val),
    z.number().int().min(1, "Movie type is required")
  ),
  dates: z.array(DateSchema).min(1, "Dates must contain at least 1 item"),
});

// Full form schema
export const ScreenAssignFormSchema = z.object({
  screenAssigns: z
    .array(ScreenAssignSchema)
    .min(1, "At least one screen assignment is required"),
});