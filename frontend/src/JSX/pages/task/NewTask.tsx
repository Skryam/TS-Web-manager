import { useApolloClient, useMutation, useQuery } from "@apollo/client/react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "react-bootstrap";
import { FormProvider } from "react-hook-form";

import { CREATE_TASK, GET_LABELS, GET_STATUSES, GET_TASKS, GET_USERS } from "../../../graphql/queries";
import { TextInput } from "../../components/TextInput";
import { SubmitButton } from "../../components/SubmitButton";
import { FormLayout } from "../../components/FormLayout";
import { SelectInput } from "../../components/SelectInput";
import { CreateTaskInput, createTaskSchema } from "../../../zodSchemas/task";

export default function NewTask() {
  const navigate = useNavigate();
  const client = useApolloClient();
  const [CreateTask] = useMutation(CREATE_TASK);

  const { data: statusesData } = useQuery(GET_STATUSES);
  const statuses = statusesData?.getStatuses?.map((s) => ({
    id: s.id,
    label: s.name
  })) ?? [];

  const { data: usersData } = useQuery(GET_USERS);
  const users = usersData?.getUsers?.map((u) => ({
    id: u.id,
    label: `${u.firstName} ${u.lastName}`
  })) ?? [];

  const { data: labelsData } = useQuery(GET_LABELS);
  const labels = labelsData?.getLabels.map((l) => ({
    id: l.id,
    label: l.name
  })) ?? [];

  const methods = useForm<CreateTaskInput>({
    resolver: zodResolver(createTaskSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: CreateTaskInput) => {
    try {
      await CreateTask({ variables: {
        data: data
      }});
      await client.refetchQueries({ include: [GET_TASKS]});
      navigate('/tasks');
    } catch (err: any) {
      console.log(err)
    }
  };

  return (
    <FormLayout title='Добавление задачи'>
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

          <SelectInput
            fieldName="executorId"
            label="Исполнитель"
            options={users}
          />

          <SelectInput
            fieldName="labels"
            label="Лейблы"
            options={labels}
            multiple
          />

          <SubmitButton />

        </Form>
      </FormProvider>
    </FormLayout>
  );
};