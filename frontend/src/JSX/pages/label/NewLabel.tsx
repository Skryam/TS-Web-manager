import { useApolloClient, useMutation } from '@apollo/client/react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from 'react-bootstrap';
import { FormProvider } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { CREATE_LABEL, GET_LABELS } from '../../../graphql/queries';
import { createLabelSchema, CreateLabelInput } from '../../../zodSchemas/label';
import { TextInput } from '../../components/TextInput';
import { SubmitButton } from '../../components/SubmitButton';
import { FormLayout } from '../../components/FormLayout';
import { useFlash } from '../../components/FlashProvider';
import { usePageErrorContext } from '../../context/PageErrorContext';
import { useLocalizedForm } from '../../../hooks/useLocalizedForm';

export default function NewLabel() {
  const flash = useFlash();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const client = useApolloClient();
  const [CreateLabel] = useMutation(CREATE_LABEL);
  const {setError} = usePageErrorContext();

  const methods = useLocalizedForm<CreateLabelInput>({
    resolver: zodResolver(createLabelSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: CreateLabelInput) => {
    try {
      await CreateLabel({
        variables: {
          data: data,
        },
      });
      await client.refetchQueries({ include: [GET_LABELS] });
      flash(t('flash.labels.create.success'));
      navigate('/labels');
    } catch (err: any) {
      flash(t('flash.labels.create.error'), 'danger');
      setError(err);
    }
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
