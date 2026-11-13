import { useQuery, useMutation } from '@apollo/client/react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { zodResolver } from '@hookform/resolvers/zod';

import { GET_USER_BY_ID, UPDATE_USER } from '../../../graphql/queries/users';
import { updateUserSchema, UpdateUserInput } from '../../../zodSchemas/user';
import { TextInput } from '../../components/TextInput';
import { SubmitButton } from '../../components/SubmitButton';
import { FormLayout } from '../../components/FormLayout';
import { useLocalizedForm } from '../../../hooks/useLocalizedForm';
import { usePageErrorContext } from '../../context/PageErrorContext';
import { QueryResult } from '../../components/QueryResult';
import { useRun } from '../../components/Run';
import { useTranslation } from 'react-i18next';
import { useIdParams } from '../../../hooks/useIdParams';

export default function EditUser() {
  const { t } = useTranslation();
  const run = useRun();
  const id = useIdParams();
  const navigate = useNavigate();
  const {setError} = usePageErrorContext();

  const { error, data, loading } = useQuery(GET_USER_BY_ID, {
    variables: { id },
    skip: !id,
  });

  const user = data?.getUser;

  const [updateUser] = useMutation(UPDATE_USER);

  const methods = useLocalizedForm<UpdateUserInput>({
    resolver: zodResolver(updateUserSchema),
    mode: 'onBlur',
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
    },
  });

  const { reset } = methods;

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: UpdateUserInput) => {
    return run(() => updateUser({ 
      variables: {
        id: id!,
        data: data,
      }
      }), {
        sucessKey: 'flash.users.patch.success',
        errorKey: 'flash.users.patch.error',
        navigateTo: '/users',
        setError
      })
    };

  return (
    <QueryResult loading={loading} error={error} data={data?.getUser} redirectPath='/statuses'>
      <FormLayout
        title={'views.statuses.edit.change'}
        providerMethods={methods}
        onSubmit={onSubmit}
      >
        <TextInput fieldName="firstName" label={'views.users.firstName'} />

        <TextInput fieldName="lastName" label={'views.users.lastName'} />

        <TextInput fieldName="email" type="email" label={'views.users.email'} />

        <div className="border-top my-4"></div>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <div className="fw-semibold">{t('views.users.edit.passwordSection')}</div>
            <div className="text-muted small">{t('views.users.edit.passwordSectionHint')}</div>
          </div>
          <Button
            variant="outline-secondary"
            onClick={() => navigate(`/users/${id}/edit/password`)}
          >
            {t('views.users.edit.changePassword')}
          </Button>
        </div>
        <div className="border-bottom my-4"></div>

        <SubmitButton />
      </FormLayout>
    </QueryResult>
  );
}
