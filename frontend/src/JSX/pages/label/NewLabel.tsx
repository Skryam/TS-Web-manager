import { useApolloClient, useMutation } from "@apollo/client/react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "react-bootstrap";
import { FormProvider } from "react-hook-form";

import { CREATE_LABEL, GET_LABELS } from "../../../graphql/queries";
import { createLabelSchema, CreateLabelInput } from "../../../zodSchemas/label";
import { TextInput } from "../../components/TextInput";
import { SubmitButton } from "../../components/SubmitButton";
import { FormLayout } from "../../components/FormLayout";

export default function NewLabel() {
  const navigate = useNavigate();
  const client = useApolloClient();
  const [CreateLabel] = useMutation(CREATE_LABEL);

  const methods = useForm<CreateLabelInput>({
    resolver: zodResolver(createLabelSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: CreateLabelInput) => {
    try {
      await CreateLabel({ variables: {
        data: data
      }});
      await client.refetchQueries({ include: [GET_LABELS]});
      navigate('/labels');
    } catch (err: any) {
      console.log(err)
    }
  };

  return (
    <FormLayout title='Добавление лейбла'>
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