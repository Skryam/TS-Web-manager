import { z } from 'zod';

export const createUserSchema = z.object({
  firstName: z.string()
    .min(2, { message: 'Имя должно содержать минимум 2 символа' })
    .max(50, { message: 'Имя не должно превышать 50 символов' })
    .regex(/^[a-zA-Zа-яА-ЯёЁ\-'\s]+$/, { message: 'Недопустимые символы в имени' }),

  lastName: z.string()
    .min(2, { message: 'Фамилия должна содержать минимум 2 символа' })
    .max(50, { message: 'Фамилия не должна превышать 50 символов' })
    .regex(/^[a-zA-Zа-яА-ЯёЁ\-'\s]+$/, { message: 'Недопустимые символы в фамилии' }),

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
export type CreateUserInput = z.infer<typeof createUserSchema>;


export const updateUserSchema = createUserSchema.partial();
export type UpdateUserInput = z.infer<typeof updateUserSchema>;


export const userResponseSchema = z.object({
  id: z.number().int().positive(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.email(),
  passwordDigest: z.string(),
  createdAt: z.date(),
  updatedAt: z.date().nullable(),
});
export type UserResponse = z.infer<typeof userResponseSchema>;


export const userPublicSchema = userResponseSchema.omit({ passwordDigest: true });
export type UserPublic = z.infer<typeof userPublicSchema>;