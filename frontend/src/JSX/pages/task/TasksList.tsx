import { useMutation, useQuery } from '@apollo/client/react';
import { Spinner, Alert, Form } from 'react-bootstrap';
import { useState } from 'react';

import { GET_TASKS, Task, TaskFilterInput } from '../../../graphql/queries';
import { TableConfig, TableList } from '../../components/TableList';

export default function TasksList() {

  const [filter, setFilter] = useState<TaskFilterInput>({});

  const { loading, error, data } = useQuery(GET_TASKS, {
    fetchPolicy: 'network-only',
  });

  if (loading) {
    return <Spinner animation="border" role="status" />;
  }
  if (error) {
    return <Alert variant="danger">Ошибка: {error.message}</Alert>;
  }
  if (!data) {
    return null;
  }

  const addButton = {
    page: 'newTask',
    label: 'Добавить задачу'
  }

  const tasks = data?.getTasks || [];

  const columns: TableConfig<Task>['columns'] = [
    {
      name: 'firstName',
      label: 'Имя',
    },
    {
      name: 'lastName',
      label: 'Фамилия',
    },
    {
      name: 'email',
      label: 'email',
    }
];

  const actionButtons = {
    editPageName: 'editTask',
    deleteAction: console.log
  };

  return (
    <div>
      <Form.Select aria-label='Фильтры'>
        <option>Select</option>
        <option value="1">One</option>
        <option value="2">Two</option>
        <option value="3">Three</option>
      </Form.Select>

      <TableList
        title='Задачи'
        addButton={addButton}
        columns={columns}
        data={tasks}
        actionButtons={actionButtons}
        >
      </TableList>
    </div>
  );
}