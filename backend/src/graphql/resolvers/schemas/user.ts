import { z } from 'zod';

export const createUserSchema = z.object({
  firstName: z.string()
    .min(2)
    .max(50)
    .regex(/^[a-zA-Zа-яА-ЯёЁ\-'\s]+$/),

  lastName: z.string()
    .min(2)
    .max(50)
    .regex(/^[a-zA-Zа-яА-ЯёЁ\-'\s]+$/),

  email: z.email()
    .max(255)
    .toLowerCase(),

  password: z.string()
    .min(8)
    .max(100)
    .regex(/[A-Z]/)
    .regex(/[a-z]/)
    .regex(/[0-9]/,
});
export type CreateUserInput = z.infer<typeof createUserSchema>;


export const updateUserSchema = createUserSchema.omit({ password: true })
  .extend({ password: z.string().optional() })
  .refine((data) => {
    if (!data.password || data.password.length === 0) {
      return true;
    }
  }, {
    error: 'Пароль должен содержать минимум 8 символов, заглавную и строчную буквы, а также цифру',
    path: ['password'],
  });
export type UpdateUserInput = z.infer<typeof updateUserSchema>;