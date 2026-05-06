import { z } from 'zod';

export const createLabelSchema = z.object({
  name: z.string()
    .min(2, { message: 'Название должно содержать минимум 2 символа' })
    .max(100, { message: 'Максимум 100 символов' })
});
export type CreateLabelInput = z.infer<typeof createLabelSchema>;

export const updateLabelSchema = createLabelSchema.partial();
export type UpdateLabelInput = z.infer<typeof updateLabelSchema>;