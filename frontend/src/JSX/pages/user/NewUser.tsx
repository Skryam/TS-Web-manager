import { useApolloClient } from '@apollo/client/react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from 'react-bootstrap';
import { FormProvider } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { getApi } from '../../../api/client';
import { GET_ME } from '../../../graphql/queries';
import { createUserSchema, CreateUserInput } from '../../../zodSchemas/user';
import { TextInput } from '../../components/TextInput';
import { SubmitButton } from '../../components/SubmitButton';
import { FormLayout } from '../../components/FormLayout';
import { useFlash } from '../../components/FlashProvider';
import { useState } from 'react';

const ERROR_KEYS: Record<string, string> = {
  USER_ALREADY_EXISTS: 'errors.userAlreadyExists',
  LOGIN_FAILED: 'errors.loginFailed'
}

export default function NewUser() {
  const flash = useFlash();
  const { t } = useTranslation();
  const api = getApi();
  const navigate = useNavigate();
  const client = useApolloClient();

  const [submitErrors, setSubmitErrors] = useState<string | null>(null);

  const methods = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: CreateUserInput) => {
    try {
      await api.post('/auth/signup', data);
      await client.refetchQueries({ include: [GET_ME] });
      flash(t('flash.users.create.success'));
      navigate('/');
    } catch (err: any) {
      flash(t('flash.users.create.error'), 'danger');
      const error = err.response?.data?.error;
      setSubmitErrors(t('views.users.new.' + ERROR_KEYS[error]) ?? 'errors.uknown');
    }
  };

  return (
    <FormLayout title={t('views.users.new.signUp')} error={submitErrors}>
      <FormProvider {...methods}>
        <Form onSubmit={methods.handleSubmit(onSubmit)}>
          <TextInput fieldName="firstName" label={t('views.users.firstName')} />

          <TextInput fieldName="lastName" label={t('views.users.lastName')} />

          <TextInput fieldName="email" type="email" label={t('views.users.email')} />

          <TextInput fieldName="password" type="password" label={t('views.users.password')} />

          <SubmitButton />
        </Form>
      </FormProvider>
    </FormLayout>
  );
}
