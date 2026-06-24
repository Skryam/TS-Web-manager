import { z } from 'zod';

export const createUserSchema = z.object({
  firstName: z.string()
    .min(2, { error: 'Имя должно содержать минимум 2 символа' })
    .max(50, { error: 'Имя не должно превышать 50 символов' })
    .regex(/^[a-zA-Zа-яА-ЯёЁ\-'\s]+$/, { error: 'Недопустимые символы в имени' }),

  lastName: z.string()
    .min(2, { error: 'Фамилия должна содержать минимум 2 символа' })
    .max(50, { error: 'Фамилия не должна превышать 50 символов' })
    .regex(/^[a-zA-Zа-яА-ЯёЁ\-'\s]+$/, { error: 'Недопустимые символы в фамилии' }),

  email: z.email({ error: 'Некорректный формат email' })
    .max(255, { error: 'Email слишком длинный' })
    .toLowerCase(),

  password: z.string()
    .min(8, { error: 'Пароль должен содержать минимум 8 символов' })
    .max(100, { error: 'Пароль слишком длинный' })
    .regex(/[A-Z]/, { error: 'Пароль должен содержать хотя бы одну заглавную букву' })
    .regex(/[a-z]/, { error: 'Пароль должен содержать хотя бы одну строчную букву' })
    .regex(/[0-9]/, { error: 'Пароль должен содержать хотя бы одну цифру' }),
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