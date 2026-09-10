import { useTranslation } from 'react-i18next';
import { z } from 'zod';

const { t } = useTranslation()

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


export const updateUserSchema = createUserSchema.omit({ password: true })
  .extend({ password: z.string().optional() })
  .refine((data) => {
    if (!data.password || data.password.length === 0) {
      return true;
    }
  }, {
    error: t('custom:views.users.edit.password.error'),
    path: ['password'],
  });
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