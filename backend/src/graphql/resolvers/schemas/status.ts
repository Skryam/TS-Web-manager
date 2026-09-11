import { z } from 'zod';

export const createStatusSchema = z.object({
  name: z.string()
    .min(2)
    .max(100)
});
export type CreateStatusInput = z.infer<typeof createStatusSchema>;

export const updateStatusSchema = createStatusSchema.partial();
export type UpdateStatusInput = z.infer<typeof updateStatusSchema>;