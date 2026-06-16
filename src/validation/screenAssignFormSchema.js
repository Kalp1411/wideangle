import { z } from "zod";

export const classPriceSchema = z.record(
  z.number().int().nonnegative(),
  z.number().int().nonnegative()
);

export const showSchema = z.object({
  show_id: z.number().int().min(1, "Show is required"),
  start_time: z.string().min(1, "Start time is required"),
  class_prices: z.record(
    z.string(), // class_id as string key
    z.number().int().nonnegative()
  ),
});

export const dateSchema = z.object({
  date: z.string().min(1, "Date is required"),
  shows: z.array(showSchema).min(1, "At least one show is required"),
});

export const screenAssignSchema = z.object({
  screen_id: z.number().int().min(1, "Screen is required"),
  language_id: z.number().int().min(1, "Language is required"),
  movie_type_id: z.number().int().min(1, "Movie type is required"),
  dates: z.array(dateSchema).min(1, "Dates must contain at least 1 item"),
});

export const screenAssignFormSchemaLatest = z.object({
  screenAssigns: z
    .array(screenAssignSchema)
    .min(1, "At least one screen assignment is required"),
});
