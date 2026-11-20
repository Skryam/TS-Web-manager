import { useQuery, useMutation } from '@apollo/client/react';
import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';

import { updateLabelSchema, UpdateLabelInput } from '../../../zodSchemas/label';
import { TextInput } from '../../components/TextInput';
import { SubmitButton } from '../../components/SubmitButton';
import { FormLayout } from '../../components/FormLayout';
import { usePageErrorContext } from '../../context/PageErrorContext';
import { useLocalizedForm } from '../../../hooks/useLocalizedForm';
import { GET_LABEL_BY_ID, UPDATE_LABEL } from '../../../graphql/queries/labels';
import { QueryResult } from '../../components/QueryResult';
import { useRun } from '../../components/Run';
import { useValidatedRoute } from '../../../hooks/useValidatedRoute';

export default function EditLabel() {
  const { id, isValid } = useValidatedRoute();
  const run = useRun();
  const { t } = useTranslation();
  const { setError } = usePageErrorContext();

  const { error, data, loading } = useQuery(GET_LABEL_BY_ID, {
    variables: { id: id ?? '' },
    skip: !isValid,
  });

  const [updateLabel] = useMutation(UPDATE_LABEL);

  const methods = useLocalizedForm<UpdateLabelInput>({
    resolver: zodResolver(updateLabelSchema),
    mode: 'onBlur',
    defaultValues: {
      name: data?.getLabel?.name || '',
    },
  });

  useEffect(() => {
    if (data?.getLabel) {
      methods.reset({ name: data.getLabel.name });
    }
  }, [data, methods.reset]);

  const onSubmit = async (formData: UpdateLabelInput) => {
    return run(() => updateLabel({ 
      variables: {
        id: id!,
        data: formData,
      },
    }), {
      sucessKey: 'flash.labels.patch.success',
      errorKey: 'flash.labels.patch.error',
      navigateTo: '/labels',
      setError,
    });
  };

  return (
    <QueryResult loading={loading} error={error} data={data?.getLabel} redirectPath='/labels'>
      <FormLayout
        title={t('views.labels.edit.change')}
        providerMethods={methods}
        onSubmit={onSubmit}
      >
        <TextInput fieldName="name" label={t('views.labels.new.name')} />
        <SubmitButton />
      </FormLayout>
    </QueryResult>
  );
}
