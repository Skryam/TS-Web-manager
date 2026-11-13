import { useMutation, useQuery } from '@apollo/client/react';
import { zodResolver } from '@hookform/resolvers/zod';


import { TextInput } from '../../components/TextInput';
import { SubmitButton } from '../../components/SubmitButton';
import { FormLayout } from '../../components/FormLayout';
import { SelectInput } from '../../components/SelectInput';
import { CreateTaskInput, createTaskSchema } from '../../../zodSchemas/task';
import { useTranslation } from 'react-i18next';
import { usePageErrorContext } from '../../context/PageErrorContext';
import { useLocalizedForm } from '../../../hooks/useLocalizedForm';
import { CREATE_TASK } from '../../../graphql/queries/tasks';
import { GET_STATUSES } from '../../../graphql/queries/statuses';
import { GET_USERS } from '../../../graphql/queries/users';
import { GET_LABELS } from '../../../graphql/queries/labels';
import { useRun } from '../../components/Run';

export default function NewTask() {
  const run = useRun();
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
    return run(() => CreateTask({ 
      variables: {
        data: data,
      }
    }), {
      sucessKey: 'flash.tasks.create.success',
      errorKey: 'flash.tasks.create.error',
      navigateTo: '/tasks',
      setError
    })
  };

  return (
  <FormLayout
    title={'views.tasks.new.create'}
    providerMethods={methods}
    onSubmit={onSubmit}
    >
      <TextInput fieldName="name" label={t('views.tasks.new.name')} />

      <TextInput fieldName="description" label={t('views.tasks.new.description')} as="textarea" rows={5} />

      <SelectInput fieldName="statusId" label={t('views.tasks.new.status')} options={statuses} />

      <SelectInput fieldName="executorId" label={t('views.tasks.new.executor')} options={users} />

      <SelectInput fieldName="labels" label={t('views.tasks.new.labels')} options={labels} multiple />

      <SubmitButton />
    </FormLayout>
  );
}
