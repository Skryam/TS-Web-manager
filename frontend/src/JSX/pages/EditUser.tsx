import { useQuery, useMutation } from "@apollo/client/react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form"
import { Alert, Spinner, Form } from "react-bootstrap";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider } from "react-hook-form";

import { GET_USER_BY_ID, UPDATE_USER } from "../../graphql/queries";
import { updateUserSchema, UpdateUserInput } from '../../zodSchemas/user';
import { TextInput } from "../components/TextInput";
import { SubmitButton } from "../components/SubmitButton";
import { FormLayout } from "../components/FormLayout";

export default function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [submitErrors, setSubmitErrors] = useState<string | null>(null)

  const { error, data: userData, loading } = useQuery(GET_USER_BY_ID, {
    variables: { id },
    skip: !id,
  });
  
  const [updateUser] = useMutation(UPDATE_USER);

  const methods = useForm<UpdateUserInput>({
    resolver: zodResolver(updateUserSchema),
    mode: 'onBlur',
    defaultValues: {
      firstName: userData?.user.firstName || '',
      lastName: userData?.user.lastName || '',
      email: userData?.user.email || '',
      password: '',
    },
  });

  const { reset } = methods;

  useEffect(() => {
    if (userData?.user) {
      reset({
        firstName: userData.user.firstName,
        lastName: userData.user.lastName,
        email: userData.user.email,
        password: '',
      });
    }
  }, [userData, reset])

  const onSubmit = async (data: UpdateUserInput) => {
    try {
      await updateUser({ variables: {
        id: id,
        data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password || undefined,
        },
      }
    });
    navigate('/users')
    } catch (err: any) {
      console.log(err)
      setSubmitErrors(err.response?.data?.message || err.message)
    }
  };

  if (loading) {
    return <Spinner animation="border" role="status" />;
  }
  if (error) {
    return <Alert variant="danger">Ошибка: {error.message}</Alert>;
  }
  if (!userData?.user) {
    return <div>Пользователь не найден</div>;
  }

  return (
    <FormLayout
      title='Редактирование пользователя'
      error={submitErrors}
    >
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
  );
};