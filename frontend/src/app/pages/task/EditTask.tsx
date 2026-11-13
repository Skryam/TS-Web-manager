import { useQuery, useMutation } from '@apollo/client/react';
import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';

import { TextInput } from '../../components/TextInput';
import { SubmitButton } from '../../components/SubmitButton';
import { FormLayout } from '../../components/FormLayout';
import { CreateTaskInput, createTaskSchema } from '../../../zodSchemas/task';
import { SelectInput } from '../../components/SelectInput';
import { usePageErrorContext } from '../../context/PageErrorContext';
import { useLocalizedForm } from '../../../hooks/useLocalizedForm';
import { GET_TASK_BY_ID, UPDATE_TASK } from '../../../graphql/queries/tasks';
import { GET_STATUSES } from '../../../graphql/queries/statuses';
import { GET_USERS } from '../../../graphql/queries/users';
import { GET_LABELS } from '../../../graphql/queries/labels';
import { QueryResult } from '../../components/QueryResult';
import { useRun } from '../../components/Run';
import { useIdParams } from '../../../hooks/useIdParams';

export default function EditTask() {
  const run = useRun();
  const { t } = useTranslation();
  const id = useIdParams();
  const { setError } = usePageErrorContext();

  const { error, data, loading } = useQuery(GET_TASK_BY_ID, {
    variables: { id },
    skip: !id,
  });
  const task = data?.getTask;

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

  const [updateTask] = useMutation(UPDATE_TASK);

  const methods = useLocalizedForm<CreateTaskInput>({
    resolver: zodResolver(createTaskSchema),
    mode: 'onBlur',
  });

  const { reset } = methods;

  useEffect(() => {
    if (task) {
      reset({
        name: task.name ?? '',
        description: task.description ?? '',
        statusId: String(task.status?.id ?? ''),
        executorId: String(task.executor?.id ?? ''),
        labels: task.labels?.map((label) => String(label.id)) ?? [],
      });
    }
  }, [task, reset]);

  const onSubmit = async (data: CreateTaskInput) => {
    return run(() => updateTask({ 
        variables: {
          id: id!,
          data: data,
        }
      }), {
        sucessKey: 'flash.tasks.patch.success',
        errorKey: 'flash.tasks.patch.error',
        navigateTo: '/tasks',
        setError
      })
    };

  return (
  <QueryResult loading={loading} error={error} data={data?.getTask} redirectPath='/tasks'>
    <FormLayout
      title={t('views.statuses.edit.change')}
      providerMethods={methods}
      onSubmit={onSubmit}
    >
      <TextInput fieldName="name" label={'views.tasks.edit.name'} />

      <TextInput
        fieldName="description"
        label={'views.tasks.edit.description'}
        as="textarea"
        rows={5}
      />

      <SelectInput
        fieldName="statusId"
        label={'views.tasks.edit.status'}
        options={statuses}
      />

      <SelectInput
        fieldName="executorId"
        label={'views.tasks.edit.executor'}
        options={users}
      />

      <SelectInput
        fieldName="labels"
        label={'views.tasks.edit.labels'}
        options={labels}
        multiple
      />

      <SubmitButton />
    </FormLayout>
  </QueryResult>
  );
}
