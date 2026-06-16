import z from "zod";

const classPricesSchema = z.preprocess((val) => {
  if (Array.isArray(val)) {
    const obj = {};
    val.forEach((v, i) => {
      obj[i] = v;
    });
    return obj;
  }
  return val;
},
z.record(
  z.string().min(1, 'Price is required.')
    .refine(val => {
      const num = Number(val.replace(/[^\d]/g, ""));
      return !isNaN(num) && num > 0;
    }, 'Price must be a valid number greater than zero.')
)
);

export const ScreenAssignFormSchema2 = z.object({
  screenAssigns: z.array(
    z.object({
      screen_id: z.union([
        z.string().min(1, "Screen is required."),
        z.number().min(1, "Screen is required.")
      ]).transform(val => String(val)),
      
      language_id: z.union([
        z.string().min(1, "Language is required."),
        z.number().min(1, "Language is required.")
      ]).transform(val => String(val)),
      
      movie_type_id: z.union([
        z.string().min(1, "Movie type is required."),
        z.number().min(1, "Movie type is required.")
      ]).transform(val => String(val)),
      
      showTimes: z.array(
        z.object({
          show_id: z.union([
            z.string().min(1, "Show is required."),
            z.number().min(1, "Show is required.")
          ]).transform(val => String(val)),
          
          start_time: z.string().min(1, "Start time is required."),
          
          class_prices: classPricesSchema,
        })
      ).min(1, "At least one show time is required.")
    })
  ).min(1, "At least one screen assignment is required.")
});