import { useMutation, useQuery } from '@apollo/client/react';
import { Spinner, Alert, Form, Badge } from 'react-bootstrap';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { DELETE_TASK, GET_TASKS, Task, TaskFilterInput } from '../../../graphql/queries';
import { TableConfig, TableList } from '../../components/TableList';

export default function TasksList() {

  const [filter, setFilter] = useState<TaskFilterInput>({});

  const { loading, error, data } = useQuery(GET_TASKS, {
    fetchPolicy: 'network-only',
  });

  const [deleteTask] = useMutation(DELETE_TASK, {
    refetchQueries: [
      { query: GET_TASKS }
    ],
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

  const handleDelete = async (id: string) => {
    try {
      await deleteTask({ variables: { id: id }});
    } catch (err) {
      console.log(err)
    }
  };

  const addButton = {
    page: 'newTask',
    label: 'Добавить задачу'
  }

  const tasks = data?.getTasks
    ? data.getTasks.map(({ id, name, description, status, executor, creator, labels, createdAt }) => ({
        id,
        name,
        description,
        status: status.name,
        executor: executor ? `${executor.firstName} ${executor.lastName}` : null,
        creator: `${creator.firstName} ${creator.lastName}`,
        labels,
        createdAt
      })) : []

  const columns: TableConfig<Task>['columns'] = [
    {
      name: 'name',
      label: 'Название',
      render: (id, value) => <Link to={`/viewTask/${id}`} className='link'>{String(value)}</Link>
    },
    {
      name: 'description',
      label: 'Описание',
    },
    {
      name: 'status',
      label: 'Статус',
    },
    {
      name: 'executor',
      label: 'Исполнитель',
    },
    {
      name: 'labels',
      label: 'Лейблы',
      render: (id, value) => value.map((label) => (
          <Badge key={label.name} bg="info" className="me-1 text-white">
            {label.name}
          </Badge>
        ))
      }
  ];

  const actionButtons = {
    editPageName: 'editTask',
    deleteAction: handleDelete
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