import { z } from 'zod';

export const createStatusSchema = z.object({
  name: z.string()
    .min(2, { message: 'Название должно содержать минимум 2 символа' })
    .max(100, { message: 'Максимум 100 символов' })
});
export type CreateStatusInput = z.infer<typeof createStatusSchema>;

export const updateStatusSchema = createStatusSchema.partial();
export type UpdateStatusInput = z.infer<typeof updateStatusSchema>;