import { z } from 'zod';

export const createTaskSchema = z.object({
  name: z.string()
    .min(2, { error: 'Название должно содержать минимум 2 символа' })
    .max(50, { error: 'Название не должно превышать 50 символов' })
    .regex(/^[a-zA-Zа-яА-ЯёЁ\-'\s]+$/, { error: 'Недопустимые символы в названии' }),

  description: z.string().optional(),

  statusId: z.string({ error: 'Необходимо указать статус' }),

  executorId: z.string().optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;