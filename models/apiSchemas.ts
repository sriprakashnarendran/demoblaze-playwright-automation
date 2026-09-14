import { z } from "zod";

export const productResponseSchema = z.object({
  cat: z.string(),
  desc: z.string(),
  id: z.number(),
  img: z.string(),
  price: z.number(),
  title: z.string(),
});

export const apiErrorSchema = z
  .object({
    errorMessage: z.string(),
  })
  .passthrough();

export type ProductResponse = z.infer<typeof productResponseSchema>;
export type ApiErrorResponse = z.infer<typeof apiErrorSchema>;