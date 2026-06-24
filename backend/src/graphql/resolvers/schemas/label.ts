import { z } from 'zod';

export const createLabelSchema = z.object({
  name: z.string()
    .min(2)
    .max(100)
});
export type CreateLabelInput = z.infer<typeof createLabelSchema>;

export const updateLabelSchema = createLabelSchema.partial();
export type UpdateLabelInput = z.infer<typeof updateLabelSchema>;