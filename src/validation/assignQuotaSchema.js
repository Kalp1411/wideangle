import { z } from "zod";

export const quotaAssignSchema = z.object({
  movie_id: z.string().nonempty("Movie is required."),
  screen_id: z.string().nonempty("Screen is required."),
  quota_type_id: z.string().nonempty("Quota type is required."),
  dates: z.array(z.string()).optional(), // made optional
  times: z
    .array(
      z.object({
        start_time: z.string(),
        end_time: z.string(),
      })
    )
    .optional(), // already optional
  screen_seat_ids: z.array(z.number()).optional(), // made optional
});
