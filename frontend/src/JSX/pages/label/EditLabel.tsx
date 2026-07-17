import { useQuery, useMutation } from "@apollo/client/react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form"
import { Alert, Spinner, Form } from "react-bootstrap";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider } from "react-hook-form";

import { GET_LABEL_BY_ID, UPDATE_LABEL } from "../../../graphql/queries";
import { updateLabelSchema, UpdateLabelInput } from "../../../zodSchemas/label";
import { TextInput } from "../../components/TextInput";
import { SubmitButton } from "../../components/SubmitButton";
import { FormLayout } from "../../components/FormLayout";

export default function EditLabel() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [submitErrors, setSubmitErrors] = useState<string | null>(null)

  const { error, data, loading } = useQuery(GET_LABEL_BY_ID, {
    variables: { id },
    skip: !id,
  });

  const [updateLabel] = useMutation(UPDATE_LABEL);

  const methods = useForm<UpdateLabelInput>({
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
  }, [data, reset])

  const onSubmit = async (data: UpdateLabelInput) => {
    try {
      await updateLabel({ variables: {
          id: id,
          data: {
          name: data.name,
          },
        }
      });
      navigate('/labels')
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
  if (!data?.getLabel) {
    console.log(data)
    return <div>Лейбл не найден</div>;
  }

  return (
    <FormLayout
      title='Редактирование Лейбла'
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