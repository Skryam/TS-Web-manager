import { useQuery, useMutation } from "@apollo/client/react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form"
import { Alert, Spinner, Form } from "react-bootstrap";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider } from "react-hook-form";

import { GET_LABELS, GET_STATUSES, GET_TASK_BY_ID, GET_USERS, UPDATE_TASK } from "../../../graphql/queries";
import { TextInput } from "../../components/TextInput";
import { SubmitButton } from "../../components/SubmitButton";
import { FormLayout } from "../../components/FormLayout";
import { UpdateTaskInput, updateTaskSchema } from "../../../zodSchemas/task";
import { SelectInput } from "../../components/SelectInput";

export default function EditTask() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [submitErrors, setSubmitErrors] = useState<string | null>(null)

  const { error, data, loading } = useQuery(GET_TASK_BY_ID, {
    variables: { id },
    skip: !id,
  });
  const task = data?.getTask;

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

  const [updateTask] = useMutation(UPDATE_TASK);

  const methods = useForm<UpdateTaskInput>({
    resolver: zodResolver(updateTaskSchema),
    mode: 'onBlur'
  });

  const { reset } = methods;

  useEffect(() => {
  if (task) {
    reset({
      name: task.name ?? '',
      description: task.description ?? '',
      statusId: String(task.status?.id ?? ''),
      executorId: String(task.executor?.id ?? ''),
      labels: task.labels?.map(label => String(label.id)) ?? [],
    });
  }
}, [task, reset]);

  const onSubmit = async (data: UpdateTaskInput) => {
    try {
      await updateTask({ variables: {
        id: id,
        data
      }
    });
    navigate('/tasks')
    } catch (err: any) {
      console.log(err);
      setSubmitErrors(err.response?.data?.message || err.message)
    }
  };

  if (loading) {
    return <Spinner animation="border" role="status" />;
  }
  if (error) {
    return <Alert variant="danger">Ошибка: {error.message}</Alert>;
  }
  if (!data?.getTask) {
    return <div>Задача не найден</div>;
  }

  return (
    <FormLayout
      title='Редактирование задачи'
      error={submitErrors}
    >
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