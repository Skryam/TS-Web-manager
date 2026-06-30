import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "react-bootstrap";
import { FormProvider } from "react-hook-form";

import { getApi } from "../api/client";
import { createLoginSchema, CreateLoginInput } from "../zodSchemas/login";
import { getClient } from "../apollo/client";
import { TextInput } from "../components/TextInput";
import { SubmitButton } from "../components/SubmitButton";
import { FormLayout } from "../components/FormLayout";

export default function Login() {
  const client = getClient();
  const api = getApi();
  const navigate = useNavigate();
  const [submitErrors, setSubmitErrors] = useState<string | null>(null)

  const methods = useForm<CreateLoginInput>({
    resolver: zodResolver(createLoginSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: CreateLoginInput) => {
    try {
      await api.post('/auth/login', data);
      await client.resetStore();
      navigate("/");
    } catch (err: any) {
      setSubmitErrors(err.response?.data?.message || err.message);
    }
  };

  return (
    <FormLayout title='Вход' error={submitErrors ? 'Неверный логин либо пароль' : null}>
      <FormProvider {...methods}>
        <Form onSubmit={methods.handleSubmit(onSubmit)}>
        
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
  );
};