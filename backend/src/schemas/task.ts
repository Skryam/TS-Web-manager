import { z } from 'zod';

export const createTaskSchema = z.object({
  name: z.string()
    .min(2, { message: 'Название должно содержать минимум 2 символа' })
    .max(100, { message: 'Максимум 100 символов' }),

  description: z.string()
    .max(500, { message: 'Описание не должно превышать 500 символов' })
    .optional(),

  statusId: z.string().transform((val) => Number(val)),

  executorId: z.string()
    .optional()
    .transform((val) => (val === undefined ? null : Number(val))),
});
export type CreateTaskInput = z.infer<typeof createTaskSchema>;

export const updateTaskSchema = createTaskSchema.partial({ name: true, statusId: true });
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;