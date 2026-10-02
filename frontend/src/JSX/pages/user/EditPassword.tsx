import { useNavigate, useParams } from 'react-router-dom';
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
import { useLocalizedForm } from '../../../hooks/useLocalizedForm';
import { usePageErrorContext } from '../../context/PageErrorContext';

export default function EditPassword() {
  const flash = useFlash();
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const api = getApi();
  const {setError} = usePageErrorContext();

  const methods = useLocalizedForm<UpdateUserPasswordInput>({
    resolver: zodResolver(createUpdateUserPasswordSchema()),
    mode: 'onBlur',
  });

  const onSubmit = async (data: UpdateUserPasswordInput) => {
    try {
      await api.patch(`/auth/users/${id}/password`, data)
      flash(t('flash.users.patch.success'));
      navigate('/users');
    } catch (err: any) {
      flash(t('flash.users.patch.error'), 'danger');
      setError(err)
    }
  };

  return (
    <FormLayout title={t('views.users.edit.editPassword.cardName')}>
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
