import { useQuery, useMutation } from "@apollo/client/react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form"
import { Alert, Spinner, Form } from "react-bootstrap";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider } from "react-hook-form";

import { GET_STATUS_BY_ID, UPDATE_STATUS } from "../../../graphql/queries";
import { updateStatusSchema, UpdateStatusInput } from "../../../zodSchemas/status";
import { TextInput } from "../../components/TextInput";
import { SubmitButton } from "../../components/SubmitButton";
import { FormLayout } from "../../components/FormLayout";

export default function EditStatus() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [submitErrors, setSubmitErrors] = useState<string | null>(null)

  const { error, data, loading } = useQuery(GET_STATUS_BY_ID, {
    variables: { id },
    skip: !id,
  });

  const [updateStatus] = useMutation(UPDATE_STATUS);

  const methods = useForm<UpdateStatusInput>({
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
  }, [data, reset])

  const onSubmit = async (data: UpdateStatusInput) => {
    try {
      await updateStatus({ variables: {
        id: id,
        data: {
        name: data.name,
        },
      }
    });
    navigate('/statuses')
    } catch (err: any) {
      console.log(err);
      setSubmitErrors(err.response?.data?.message || err.message)
    }
  };

  if (loading) {
    return <Spinner animation="border" role="status" />;
  }
  if (error) {
    return <Alert variant="danger">Ошибка: {error.message}</Alert>;
  }
  if (!data?.getStatus) {
    return <div>Статус не найден</div>;
  }

  return (
    <FormLayout
      title='Редактирование статуса'
      error={submitErrors}
    >
      <FormProvider {...methods}>
        <Form onSubmit={methods.handleSubmit(onSubmit)}>
        
          <TextInput 
            fieldName='name'
            label='Название'
          />

          <SubmitButton />

        </Form>
      </FormProvider>
    </FormLayout>
  );
};