import { useMutation } from '@apollo/client/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from 'react-bootstrap';
import { FormProvider } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { createLabelSchema, CreateLabelInput } from '../../../zodSchemas/label';
import { TextInput } from '../../components/TextInput';
import { SubmitButton } from '../../components/SubmitButton';
import { FormLayout } from '../../components/FormLayout';
import { usePageErrorContext } from '../../context/PageErrorContext';
import { useLocalizedForm } from '../../../hooks/useLocalizedForm';
import { CREATE_LABEL } from '../../../graphql/queries/label';
import { run } from '../../components/Run';

export default function NewLabel() {
  const { t } = useTranslation();
  const [createLabel] = useMutation(CREATE_LABEL);
  const {setError} = usePageErrorContext();

  const methods = useLocalizedForm<CreateLabelInput>({
    resolver: zodResolver(createLabelSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: CreateLabelInput) => {
    return run(() => createLabel({ 
      variables: {
        data: data,
      }
    }), {
      sucessKey: 'flash.labels.create.success',
      errorKey: 'flash.labels.create.error',
      navigateTo: '/labels',
      setError
    })
  };

  return (
    <FormLayout title={t('views.labels.new.create')}>
      <FormProvider {...methods}>
        <Form onSubmit={methods.handleSubmit(onSubmit)}>
          <TextInput fieldName="name" label={t('views.labels.new.name')} />

          <SubmitButton />
        </Form>
      </FormProvider>
    </FormLayout>
  );
}
