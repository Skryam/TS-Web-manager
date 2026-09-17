import { useQuery, useMutation } from '@apollo/client/react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Alert, Spinner, Form, Button } from 'react-bootstrap';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { GET_USER_BY_ID, UPDATE_USER } from '../../../graphql/queries';
import { updateUserSchema, UpdateUserInput } from '../../../zodSchemas/user';
import { TextInput } from '../../components/TextInput';
import { SubmitButton } from '../../components/SubmitButton';
import { FormLayout } from '../../components/FormLayout';
import { useFlash } from '../../components/FlashProvider';

export default function EditUser() {
  const flash = useFlash();
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const [submitErrors, setSubmitErrors] = useState<string | null>(null);

  const { error, data, loading } = useQuery(GET_USER_BY_ID, {
    variables: { id },
    skip: !id,
  });

  const user = data?.getUser;

  const [updateUser] = useMutation(UPDATE_USER);

  const methods = useForm<UpdateUserInput>({
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
    try {
      await updateUser({
        variables: {
          id: id,
          data: {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
          },
        },
      });
      flash(t('flash.users.patch.success'));
      navigate('/users');
    } catch (err: any) {
      console.log(err)
      flash(t('flash.users.patch.error'), 'danger');
      setSubmitErrors(err.response?.data?.message || err.message);
    }
  };

  if (loading) {
    return <Spinner animation="border" role="status" />;
  }
  if (error) {
    return <Alert variant="danger">Ошибка: {error.message}</Alert>;
  }
  if (!user) {
    return <div>Пользователь не найден</div>;
  }

  return (
    <FormLayout title={t('views.users.edit.cardName')} error={submitErrors}>
      <FormProvider {...methods}>
        <Form onSubmit={methods.handleSubmit(onSubmit)}>
          <TextInput fieldName="firstName" label={t('views.users.firstName')} />

          <TextInput fieldName="lastName" label={t('views.users.lastName')} />

          <TextInput fieldName="email" type="email" label={t('views.users.email')} />

          <div className="border-top my-4"></div>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <div className="fw-semibold">{t('views.users.edit.passwordSection')}</div>
              <div className="text-muted small">{t('views.users.edit.passwordSectionHint')}</div>
            </div>
              <Button
              variant="outline-secondary"
              onClick={() => navigate(`/users/${id}/password`)}
              >
                {t('views.users.edit.changePassword')}
              </Button>
            </div>
            <div className="border-bottom my-4"></div>

          <SubmitButton />
        </Form>
      </FormProvider>
    </FormLayout>
  );
}
