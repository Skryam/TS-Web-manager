import { z } from 'zod';

export const createLoginSchema = z.object({
  email: z.email().max(255).toLowerCase(),

  password: z.string().min(8).max(100).regex(/[A-Z]/).regex(/[a-z]/).regex(/[0-9]/),
});
export type CreateLoginInput = z.infer<typeof createLoginSchema>;
