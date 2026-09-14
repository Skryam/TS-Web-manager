import { useTranslation } from 'react-i18next';
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

export const createUpdateUserSchema = () => {
  const { t } = useTranslation();
  return createUserSchema.omit({ password: true })
    .extend({ password: z.string().optional() })
    .refine((data) => {
      if (!data.password || data.password.length === 0) {
        return true;
      }
      return data.password.length >= 8;
    }, {
      error: t('views.users.edit.password.error'),
      path: ['password'],
    });
}
export type UpdateUserInput = z.infer<typeof createUpdateUserSchema>;


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