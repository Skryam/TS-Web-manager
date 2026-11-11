import { useQuery, useMutation } from '@apollo/client/react';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';

import { updateLabelSchema, UpdateLabelInput } from '../../../zodSchemas/label';
import { TextInput } from '../../components/TextInput';
import { SubmitButton } from '../../components/SubmitButton';
import { FormLayout } from '../../components/FormLayout';
import { usePageErrorContext } from '../../context/PageErrorContext';
import { useLocalizedForm } from '../../../hooks/useLocalizedForm';
import { GET_LABEL_BY_ID, UPDATE_LABEL } from '../../../graphql/queries/label';
import { QueryResult } from '../../components/QueryResult';
import { useRun } from '../../components/Run';

export default function EditLabel() {
  const run = useRun();
  const { t } = useTranslation();
  const { id } = useParams();
  const { setError } = usePageErrorContext();

  if (id) {
    const { error, data, loading } = useQuery(GET_LABEL_BY_ID, {
      variables: { id },
      skip: !id,
    });

    const [updateLabel] = useMutation(UPDATE_LABEL);

    const methods = useLocalizedForm<UpdateLabelInput>({
      resolver: zodResolver(updateLabelSchema),
      mode: 'onBlur',
      defaultValues: {
        name: data?.getLabel?.name || '',
      },
    });

    const { reset } = methods;

    useEffect(() => {
      if (data?.getLabel) {
        reset({
          name: data.getLabel.name,
        });
      }
    }, [data, reset]);

    const onSubmit = async (data: UpdateLabelInput) => {
      return run(() => updateLabel({ 
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
}
