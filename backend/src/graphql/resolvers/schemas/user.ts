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
    .regex(/[0-9]/),
});
export type CreateUserInput = z.infer<typeof createUserSchema>;

export const updateUserSchema = createUserSchema.omit({ password: true });
export type UpdateUserInput = z.infer<typeof updateUserSchema>;

export const createUpdateUserPasswordSchema = () => {
  return z.object({
    password: z.string().min(8).max(100).regex(/[A-Z]/).regex(/[a-z]/).regex(/[0-9]/),
    newPassword: z.string().min(8).max(100).regex(/[A-Z]/).regex(/[a-z]/).regex(/[0-9]/),
    confirmPassword: z.string()
  }).refine((data) => data.newPassword === data.confirmPassword, {
    path: ['confirmPassword'],
  })
};
export type UpdateUserPasswordInput = z.infer<ReturnType<typeof createUpdateUserPasswordSchema>>;