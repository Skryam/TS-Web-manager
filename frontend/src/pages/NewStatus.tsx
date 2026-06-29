import { useMutation } from "@apollo/client/react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "react-bootstrap";

import { CREATE_STATUS } from "../graphql/queries";
import { CreateStatusInput, createStatusSchema } from "../zodSchemas/status";
import { TextInput } from "../components/textInput";
import { SubmitButton } from "../components/submitButton";
import { FormProvider } from "react-hook-form";

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
    <div className="container mt-5" style={{ maxWidth: '500px' }}>
      <h3 className="display-4 fw-bold mt-4">Добавление статуса</h3>

      <FormProvider {...methods}>
        <Form onSubmit={methods.handleSubmit(onSubmit)}>
        
          <TextInput 
            fieldName='name'
            label='Название'
          />

          <SubmitButton />

      </Form>
    </FormProvider>
  </div>
  );
};