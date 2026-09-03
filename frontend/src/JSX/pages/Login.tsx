import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "react-bootstrap";
import { FormProvider } from "react-hook-form";
import { useTranslation } from "react-i18next"

import { getApi } from "../../api/client";
import { createLoginSchema, CreateLoginInput } from "../../zodSchemas/login";
import { getClient } from "../../apollo/client";
import { TextInput } from "../components/TextInput";
import { SubmitButton } from "../components/SubmitButton";
import { FormLayout } from "../components/FormLayout";

export default function Login() {
  const { t } = useTranslation();
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
    <FormLayout title={t('views.session.new.signIn')} error={submitErrors ? t('views.session.new.error') : null}>
      <FormProvider {...methods}>
        <Form onSubmit={methods.handleSubmit(onSubmit)}>
        
          <TextInput 
            fieldName='email'
            label={t('views.session.new.email')}
          />

          <TextInput 
            fieldName='password'
            label={t('views.session.new.password')}
          />

          <SubmitButton />

        </Form>
      </FormProvider>
    </FormLayout>
  );
};