import { useApolloClient } from "@apollo/client/react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "react-bootstrap";
import { FormProvider } from "react-hook-form";
import { useTranslation } from "react-i18next"

import { getApi } from "../../../api/client";
import { GET_ME } from "../../../graphql/queries";
import { createUserSchema, CreateUserInput } from '../../../zodSchemas/user';
import { TextInput } from "../../components/TextInput";
import { SubmitButton } from "../../components/SubmitButton";
import { FormLayout } from "../../components/FormLayout";

export default function NewUser() {
  const { t } = useTranslation();
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
    <FormLayout title={t('views.users.new.signUp')}>
      <FormProvider {...methods}>
        <Form onSubmit={methods.handleSubmit(onSubmit)}>
        
          <TextInput 
            fieldName='firstName'
            label={t('views.users.firstName')}
          />

          <TextInput 
            fieldName='lastName'
            label={t('views.users.lastName')}
          />
          
          <TextInput 
            fieldName='email'
            label={t('views.users.email')}
          />

          <TextInput 
            fieldName='password'
            label={t('views.users.password')}
          />

          <SubmitButton />

        </Form>
      </FormProvider>
    </FormLayout>
  )
};