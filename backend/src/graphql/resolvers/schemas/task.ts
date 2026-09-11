import { z } from 'zod';

export const createTaskSchema = z.object({
  name: z.string()
    .min(2)
    .max(100),

  description: z.string()
    .max(500)
    .optional(),

  statusId: z.string().transform((val) => Number(val)),

  executorId: z.string()
    .optional()
    .transform((val) => (val === undefined || "" ? null : Number(val))),

  labels: z.array(z.string() || z.number()).optional()
});
export type CreateTaskInput = z.infer<typeof createTaskSchema>;

export const updateTaskSchema = createTaskSchema.partial({ name: true, statusId: true });
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;