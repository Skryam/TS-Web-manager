import { useMutation, useQuery } from '@apollo/client/react';
import { Spinner, Alert, Form, Badge } from 'react-bootstrap';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { DELETE_TASK, GET_LABELS, GET_STATUSES, GET_TASKS, GET_USERS, Task, TaskFilterInput } from '../../../graphql/queries';
import { TableConfig, TableList } from '../../components/TableList';
import { SelectInput } from '../../components/SelectInput';

export default function TasksList() {

  const [filters, setFilters] = useState<TaskFilterInput>({
    statusId: '',
    executorId: '',
    labelId: [],
    isCreatorOnly: false,
  });

  const { loading, error, data } = useQuery(GET_TASKS, {
    fetchPolicy: 'network-only',
    variables: {
      filter: {
        statusId: filters.statusId || undefined,
        executorId: filters.statusId || undefined,
        labelId: filters.labelId || undefined,
        isCreatorOnly: filters.isCreatorOnly ? true : undefined
      }
    },
  });

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

  const handleFilterChange = (field: string, value: any) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  }

  return (
    <div>
      <div className='row mb-4'>
        <div className='col-md-3'>
          <Form.Select
          id='filter-status'
          className='form-select'
          value={filters.statusId}
          onChange={(e) => handleFilterChange('statusId', e.target.value)}
          >
          <option value=""></option>
          {statuses.map((opt) => (
            <option key={opt.id} value={String(opt.id)}>
              {opt.label}
            </option>
          ))}
          </Form.Select>
        </div>

        <div className='col-md-3'>
          <Form.Select
          id='filter-status'
          className='form-select'
          value={filters.statusId}
          onChange={(e) => handleFilterChange('statusId', e.target.value)}
          >
          <option value=""></option>
          {statuses.map((opt) => (
            <option key={opt.id} value={String(opt.id)}>
              {opt.label}
            </option>
          ))}
          </Form.Select>
        </div>
      </div>

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