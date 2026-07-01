import { useMutation } from "@apollo/client/react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "react-bootstrap";
import { FormProvider } from "react-hook-form";

import { CREATE_STATUS } from "../../graphql/queries";
import { CreateStatusInput, createStatusSchema } from "../../zodSchemas/status";
import { TextInput } from "../components/TextInput";
import { SubmitButton } from "../components/SubmitButton";
import { FormLayout } from "../components/FormLayout";

export default function NewStatus() {
  const navigate = useNavigate();
  const [CreateStatus] = useMutation(CREATE_STATUS);

  const methods = useForm<CreateStatusInput>({
    resolver: zodResolver(createStatusSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: CreateStatusInput) => {
    console.log(data)
    try {
      await CreateStatus({ variables: {
        data: data
      }});
      navigate('/statuses');
    } catch (err: any) {
      console.log(err)
    }
  };

  return (
    <FormLayout title='Добавление статуса'>
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