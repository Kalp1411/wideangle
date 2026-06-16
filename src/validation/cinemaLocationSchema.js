import { z } from "zod";

const optionalString = () =>
  z.preprocess((val) => {
    if (val === "" || val === undefined) return null;
    return val;
  }, z.string().nullable().optional());

export const cinemaLocationSchema = z.object({
  name: z.string().min(1, "Name is required."),
  address: optionalString(),
  city_id: z.coerce.string().min(1, "City is required."),
  state_id: z.coerce.string().min(1, "State is required."),
});