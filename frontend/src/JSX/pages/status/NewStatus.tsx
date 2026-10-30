import { useMutation } from '@apollo/client/react';
import { zodResolver } from '@hookform/resolvers/zod';

import { CREATE_STATUS } from '../../../graphql/queries/status';
import { CreateStatusInput, createStatusSchema } from '../../../zodSchemas/status';
import { TextInput } from '../../components/TextInput';
import { SubmitButton } from '../../components/SubmitButton';
import { FormLayout } from '../../components/FormLayout';
import { usePageErrorContext } from '../../context/PageErrorContext';
import { useLocalizedForm } from '../../../hooks/useLocalizedForm';
import { run } from '../../components/Run';

export default function NewStatus() {
  const [CreateStatus] = useMutation(CREATE_STATUS);

  const {setError} = usePageErrorContext();

  const methods = useLocalizedForm<CreateStatusInput>({
    resolver: zodResolver(createStatusSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: CreateStatusInput) => {
    return run(() => CreateStatus({ 
      variables: {
        data: data,
      }
    }), {
      sucessKey: 'flash.labels.create.success',
      errorKey: 'flash.labels.create.error',
      navigateTo: '/statuses',
      setError
    })
  };

  return (
    <FormLayout
      title={'views.labels.new.create'}
      providerMethods={methods}
      onSubmit={onSubmit}
      >
        <TextInput fieldName="name" label={'views.labels.new.name'} />

        <SubmitButton />
    </FormLayout>
  );
}
