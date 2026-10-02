import { useApolloClient, useMutation, useQuery } from '@apollo/client/react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from 'react-bootstrap';
import { FormProvider } from 'react-hook-form';

import {
  CREATE_TASK,
  GET_LABELS,
  GET_STATUSES,
  GET_TASKS,
  GET_USERS,
} from '../../../graphql/queries';
import { TextInput } from '../../components/TextInput';
import { SubmitButton } from '../../components/SubmitButton';
import { FormLayout } from '../../components/FormLayout';
import { SelectInput } from '../../components/SelectInput';
import { CreateTaskInput, createTaskSchema } from '../../../zodSchemas/task';
import { useFlash } from '../../components/FlashProvider';
import { useTranslation } from 'react-i18next';
import { usePageErrorContext } from '../../context/PageErrorContext';
import { useLocalizedForm } from '../../../hooks/useLocalizedForm';

export default function NewTask() {
  const flash = useFlash();
  const navigate = useNavigate();
  const client = useApolloClient();
  const [CreateTask] = useMutation(CREATE_TASK);
  const { t } = useTranslation();
  const {setError} = usePageErrorContext();

  const { data: statusesData } = useQuery(GET_STATUSES);
  const statuses =
    statusesData?.getStatuses?.map((s) => ({
      id: s.id,
      label: s.name,
    })) ?? [];

  const { data: usersData } = useQuery(GET_USERS);
  const users =
    usersData?.getUsers?.map((u) => ({
      id: u.id,
      label: `${u.firstName} ${u.lastName}`,
    })) ?? [];

  const { data: labelsData } = useQuery(GET_LABELS);
  const labels =
    labelsData?.getLabels.map((l) => ({
      id: l.id,
      label: l.name,
    })) ?? [];

  const methods = useLocalizedForm<CreateTaskInput>({
    resolver: zodResolver(createTaskSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: CreateTaskInput) => {
    try {
      await CreateTask({
        variables: {
          data: data,
        },
      });
      await client.refetchQueries({ include: [GET_TASKS] });
      flash(t('flash.tasks.create.success'));
      navigate('/tasks');
    } catch (err: any) {
      flash(t('flash.tasks.create.error'), 'danger');
      setError(err);
    }
  };

  return (
    <FormLayout title={t('views.tasks.new.title')}>
      <FormProvider {...methods}>
        <Form onSubmit={methods.handleSubmit(onSubmit)}>
          <TextInput fieldName="name" label={t('views.tasks.new.name')} />

          <TextInput fieldName="description" label={t('views.tasks.new.description')} as="textarea" rows={5} />

          <SelectInput fieldName="statusId" label={t('views.tasks.new.status')} options={statuses} />

          <SelectInput fieldName="executorId" label={t('views.tasks.new.executor')} options={users} />

          <SelectInput fieldName="labels" label={t('views.tasks.new.labels')} options={labels} multiple />

          <SubmitButton />
        </Form>
      </FormProvider>
    </FormLayout>
  );
}
