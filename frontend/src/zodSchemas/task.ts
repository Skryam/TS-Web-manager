import { z } from 'zod';

export const createTaskSchema = z.object({
  name: z
    .string()
    .min(2)
    .max(50),

  description: z.string().max(1000).optional(),

  statusId: z.string().min(1),

  executorId: z
    .string()
    .transform((val) => (val === '' ? undefined : val))
    .optional(),

  labels: z.array(z.string().min(1, 'id лейбла не может быть пустым')).default([]).optional(),
});
export type CreateTaskInput = z.infer<typeof createTaskSchema>;

export const updateTaskSchema = createTaskSchema.partial();
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
