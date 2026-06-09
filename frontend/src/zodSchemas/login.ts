import { z } from 'zod';

export const createLoginSchema = z.object({
  email: z.email({ message: 'Некорректный формат email' })
    .max(255, { message: 'Email слишком длинный' })
    .toLowerCase(),

  password: z.string()
    .min(8, { message: 'Пароль должен содержать минимум 8 символов' })
    .max(100, { message: 'Пароль слишком длинный' })
    .regex(/[A-Z]/, { message: 'Пароль должен содержать хотя бы одну заглавную букву' })
    .regex(/[a-z]/, { message: 'Пароль должен содержать хотя бы одну строчную букву' })
    .regex(/[0-9]/, { message: 'Пароль должен содержать хотя бы одну цифру' }),
});
export type CreateLoginInput = z.infer<typeof createLoginSchema>;