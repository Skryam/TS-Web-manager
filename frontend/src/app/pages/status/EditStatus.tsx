import { useQuery, useMutation } from '@apollo/client/react';
import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';

import { GET_STATUS_BY_ID, UPDATE_STATUS } from '../../../graphql/queries/statuses';
import { updateStatusSchema, UpdateStatusInput } from '../../../zodSchemas/status';
import { TextInput } from '../../components/TextInput';
import { SubmitButton } from '../../components/SubmitButton';
import { FormLayout } from '../../components/FormLayout';
import { usePageErrorContext } from '../../context/PageErrorContext';
import { useLocalizedForm } from '../../../hooks/useLocalizedForm';
import { QueryResult } from '../../components/QueryResult';
import { useRun } from '../../components/Run';
import { useIdParams } from '../../../hooks/useIdParams';

export default function EditStatus() {
  const run = useRun();
  const { t } = useTranslation();
  const id = useIdParams();
  const { setError } = usePageErrorContext();
  
  const { error, data, loading } = useQuery(GET_STATUS_BY_ID, {
    variables: { id },
    skip: !id,
  });

  const [updateStatus] = useMutation(UPDATE_STATUS);

  const methods = useLocalizedForm<UpdateStatusInput>({
    resolver: zodResolver(updateStatusSchema),
    mode: 'onBlur',
    defaultValues: {
      name: data?.getStatus?.name || '',
    },
  });

  const { reset } = methods;

  useEffect(() => {
    if (data?.getStatus) {
      reset({
        name: data.getStatus.name,
      });
    }
  }, [data, reset]);

  const onSubmit = async (data: UpdateStatusInput) => {
    return run(() => updateStatus({ 
      variables: {
        id: id!,
        data: data,
      }
    }), {
      sucessKey: 'flash.labels.patch.success',
      errorKey: 'flash.labels.patch.error',
      navigateTo: '/labels',
      setError
    })
  };

  return (
    <QueryResult loading={loading} error={error} data={data?.getStatus} redirectPath='/statuses'>
      <FormLayout
        title={t('views.statuses.edit.change')}
        providerMethods={methods}
        onSubmit={onSubmit}
      >
        <TextInput fieldName="name" label={t('views.statuses.new.name')} />
        <SubmitButton />
      </FormLayout>
    </QueryResult>

  );
}
