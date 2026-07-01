import { useApolloClient } from "@apollo/client/react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "react-bootstrap";
import { FormProvider } from "react-hook-form";

import { getApi } from "../../api/client";
import { GET_ME } from "../../graphql/queries";
import { createUserSchema, CreateUserInput } from '../../zodSchemas/user';
import { TextInput } from "../components/TextInput";
import { SubmitButton } from "../components/SubmitButton";
import { FormLayout } from "../components/FormLayout";

export default function NewUser() {
  const api = getApi();
  const navigate = useNavigate();
  const client = useApolloClient();

  const methods = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: CreateUserInput) => {
    try {
      await api.post('/auth/signup', data);
      await client.refetchQueries({ include: [GET_ME]});
      navigate("/");
    } catch (err: unknown) {
      console.log(err)
    }
  };

  return (
    <FormLayout title='Регистрация'>
      <FormProvider {...methods}>
        <Form onSubmit={methods.handleSubmit(onSubmit)}>
        
          <TextInput 
            fieldName='firstName'
            label='Имя'
          />

          <TextInput 
            fieldName='lastName'
            label='Фамилия'
          />
          
          <TextInput 
            fieldName='email'
            label='email'
          />

          <TextInput 
            fieldName='password'
            label='Пароль'
          />

          <SubmitButton />

        </Form>
      </FormProvider>
    </FormLayout>
  )
};