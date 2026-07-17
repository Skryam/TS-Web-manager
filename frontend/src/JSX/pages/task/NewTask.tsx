import { useApolloClient, useMutation, useQuery } from "@apollo/client/react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "react-bootstrap";
import { FormProvider } from "react-hook-form";

import { CREATE_STATUS, GET_STATUSES } from "../../../graphql/queries";
import { CreateStatusInput, createStatusSchema } from "../../../zodSchemas/status";
import { TextInput } from "../../components/TextInput";
import { SubmitButton } from "../../components/SubmitButton";
import { FormLayout } from "../../components/FormLayout";
import { SelectInput } from "../../components/SelectInput";

export default function NewStatus() {
  const navigate = useNavigate();
  const client = useApolloClient();
  //const [CreateTask] = useMutation(CREATE_TASK);

  const { data: statusesData } = useQuery(GET_STATUSES);
  const statuses = statusesData?.getStatuses?.map((s) => ({
    id: s.id,
    label: s.name
  })) ?? [];

  const methods = useForm<CreateTaskInput>({
    resolver: zodResolver(createTaskSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: CreateStatusInput) => {
    console.log(data)
    try {
      await CreateStatus({ variables: {
        data: data
      }});
      await client.refetchQueries({ include: [GET_STATUSES]});
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

          <TextInput 
            fieldName='description'
            label='Описание'
            as='textarea'
            rows={5}
          />

          <SelectInput
            fieldName="statusId"
            label="Статус"
            options={statuses}
          />


          <SubmitButton />

        </Form>
      </FormProvider>
    </FormLayout>
  );
};