import { z } from 'zod';

export const createTaskSchema = z.object({
  name: z
    .string()
    .min(2, { error: 'Название должно содержать минимум 2 символа' })
    .max(50, { error: 'Название не должно превышать 50 символов' }),

  description: z.string().max(1000).optional(),

  statusId: z.string().min(1, { error: 'Необходимо указать статус' }),

  executorId: z
    .string()
    .transform((val) => (val === '' ? undefined : val))
    .optional(),

  labels: z.array(z.string().min(1, 'id лейбла не может быть пустым')).default([]).optional(),
});
export type CreateTaskInput = z.infer<typeof createTaskSchema>;

export const updateTaskSchema = createTaskSchema.partial();
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
