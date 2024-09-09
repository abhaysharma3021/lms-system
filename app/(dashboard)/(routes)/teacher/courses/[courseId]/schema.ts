import * as z from "zod";

export const titleSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
});

export const descriptionSchema = z.object({
  description: z.string().min(1, {
    message: "Description is required",
  }),
});

export const imageSchema = z.object({
  imageUrl: z.string().min(1, {
    message: "Image is required",
  }),
});

export const categorySchema = z.object({
  categoryId: z.string().min(1),
});

export const priceSchema = z.object({
  price: z.coerce.number(),
});

export const attachmentSchema = z.object({
  url: z.string().min(1),
});

export const chapterSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
});
