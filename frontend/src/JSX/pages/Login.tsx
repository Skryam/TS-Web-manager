import { zodResolver } from '@hookform/resolvers/zod';

import { getApi } from '../../api/client';
import { createLoginSchema, CreateLoginInput } from '../../zodSchemas/login';
import { TextInput } from '../components/TextInput';
import { SubmitButton } from '../components/SubmitButton';
import { FormLayout } from '../components/FormLayout';
import { useLocalizedForm } from '../../hooks/useLocalizedForm';
import { usePageErrorContext } from '../context/PageErrorContext';
import { t } from 'i18next';
import { useRun } from '../components/Run';
import { getClient } from '../../apollo/client';

export default function Login() {
  const run = useRun();
  const api = getApi();
  const {setError} = usePageErrorContext();

  const methods = useLocalizedForm<CreateLoginInput>({
    resolver: zodResolver(createLoginSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: CreateLoginInput) => {
    return run(async () => {
      const res = api.post('/auth/login', data);
      await getClient().resetStore();
      return res;
    }, {
      sucessKey: 'flash.session.create.success',
      errorKey: 'flash.session.create.error',
      navigateTo: '/',
      setError
      })
    };

  return (
  <FormLayout
    title={'views.session.new.signIn'}
    providerMethods={methods}
    onSubmit={onSubmit}
    >
      <TextInput fieldName="email" type="email" label={t('views.session.new.email')} />

      <TextInput fieldName="password" type="password" label={t('views.session.new.password')} />

      <SubmitButton />
    </FormLayout>
  );
}
