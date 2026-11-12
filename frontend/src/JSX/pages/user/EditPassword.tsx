import { zodResolver } from '@hookform/resolvers/zod';

import { createUpdateUserPasswordSchema, UpdateUserPasswordInput } from '../../../zodSchemas/user';
import { TextInput } from '../../components/TextInput';
import { SubmitButton } from '../../components/SubmitButton';
import { FormLayout } from '../../components/FormLayout';
import { getApi } from '../../../api/client';
import { useLocalizedForm } from '../../../hooks/useLocalizedForm';
import { usePageErrorContext } from '../../context/PageErrorContext';
import { QueryResult } from '../../components/QueryResult';
import { useRun } from '../../components/Run';
import { useQuery } from '@apollo/client/react';
import { GET_USER_BY_ID } from '../../../graphql/queries/user';
import { useIdParams } from '../../../hooks/useIdParams';

export default function EditPassword() {
  const run = useRun();
  const id = useIdParams();
  const api = getApi();
  const {setError} = usePageErrorContext();

  const { error, data, loading } = useQuery(GET_USER_BY_ID, {
    variables: { id },
    skip: !id,
  });
  console.log(id, error, data)

  const methods = useLocalizedForm<UpdateUserPasswordInput>({
    resolver: zodResolver(createUpdateUserPasswordSchema()),
    mode: 'onBlur',
  });

  const onSubmit = async (data: UpdateUserPasswordInput) => {
    return run(async () => {
      return api.patch(`/auth/users/${id}/password`, data);
      }, {
      sucessKey: 'flash.users.patch.success',
      errorKey: 'flash.users.patch.error',
      navigateTo: '/',
      setError
    })
  };

  return (
    <QueryResult loading={loading} error={error} data={data?.getUser} redirectPath='/users'>
      <FormLayout
        title={'views.statuses.edit.change'}
        providerMethods={methods}
        onSubmit={onSubmit}
      >
        <TextInput fieldName="password" type="password" label={'views.users.edit.editPassword.password'} />

        <TextInput fieldName="newPassword" type="password" label={'views.users.edit.editPassword.newPassword'} />

        <TextInput fieldName="confirmPassword" type="password" label={'views.users.edit.editPassword.submitPassword'} />

        <SubmitButton />
      </FormLayout>
    </QueryResult>
  );
}
