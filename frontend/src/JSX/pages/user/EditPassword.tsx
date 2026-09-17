import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Form } from 'react-bootstrap';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { createUpdateUserPasswordSchema, UpdateUserPasswordInput } from '../../../zodSchemas/user';
import { TextInput } from '../../components/TextInput';
import { SubmitButton } from '../../components/SubmitButton';
import { FormLayout } from '../../components/FormLayout';
import { useFlash } from '../../components/FlashProvider';
import { getApi } from '../../../api/client';

export default function EditPassword() {
  const flash = useFlash();
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const api = getApi();

  const [submitErrors, setSubmitErrors] = useState<string | null>(null);

  const methods = useForm<UpdateUserPasswordInput>({
    resolver: zodResolver(createUpdateUserPasswordSchema()),
    mode: 'onBlur',
  });

  const onSubmit = async (data: UpdateUserPasswordInput) => {
    try {
      await api.patch(`users/${id}/password`, data)
      flash(t('flash.users.patch.success'));
      navigate('/users');
    } catch (err: any) {
      flash(t('flash.users.patch.error'), 'danger');
      setSubmitErrors(err.response?.data?.message || err.message);
    }
  };

  return (
    <FormLayout title={t('views.users.edit.editPassword.cardName')} error={submitErrors}>
      <FormProvider {...methods}>
        <Form onSubmit={methods.handleSubmit(onSubmit)}>
          <TextInput fieldName="password" type="password" label={t('views.users.edit.editPassword.password')} />

          <TextInput fieldName="newPassword" type="password" label={t('views.users.edit.editPassword.newPassword')} />

          <TextInput fieldName="confirmPassword" type="password" label={t('views.users.edit.editPassword.submitPassword')} />

          <SubmitButton />
        </Form>
      </FormProvider>
    </FormLayout>
  );
}
