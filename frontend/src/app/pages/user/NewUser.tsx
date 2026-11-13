import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';

import { getApi } from '../../../api/client';
import { createUserSchema, CreateUserInput } from '../../../zodSchemas/user';
import { TextInput } from '../../components/TextInput';
import { SubmitButton } from '../../components/SubmitButton';
import { FormLayout } from '../../components/FormLayout';
import { usePageErrorContext } from '../../context/PageErrorContext';
import { useLocalizedForm } from '../../../hooks/useLocalizedForm';
import { useRun } from '../../components/Run';
import { getClient } from '../../../apollo/client';

export default function NewUser() {
  const run = useRun();
  const { t } = useTranslation();
  const api = getApi();
  const {setError} = usePageErrorContext();

  const methods = useLocalizedForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: CreateUserInput) => {
    return run(async () => {
      const res = await api.post('/auth/signup', data);
      await getClient().resetStore();
      return res;
      }, {
      sucessKey: 'flash.users.create.success',
      errorKey: 'flash.users.create.error',
      navigateTo: '/',
      setError
    })
  };

  return (
  <FormLayout
    title={'views.users.new.signUp'}
    providerMethods={methods}
    onSubmit={onSubmit}
    >
      <TextInput fieldName="firstName" label={t('views.users.firstName')} />

      <TextInput fieldName="lastName" label={t('views.users.lastName')} />

      <TextInput fieldName="email" type="email" label={t('views.users.email')} />

      <TextInput fieldName="password" type="password" label={t('views.users.password')} />

      <SubmitButton />
    </FormLayout>
  );
}
