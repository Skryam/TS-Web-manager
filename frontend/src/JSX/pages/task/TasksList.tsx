import { useMutation, useQuery } from '@apollo/client/react';
import { Spinner, Alert, Form, Badge, Button } from 'react-bootstrap';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { DELETE_TASK, GET_LABELS, GET_STATUSES, GET_TASKS, GET_USERS, Task, TaskFilterInput } from '../../../graphql/queries';
import { TableConfig, TableList } from '../../components/TableList';

export default function TasksList() {

  const [inputFilters, setInputFilters] = useState<TaskFilterInput>({
    statusId: '',
    executorId: '',
    labelId: [],
    isCreatorOnly: false,
  });

  const [activeFilters, setActiveFilters] = useState<TaskFilterInput>({
    statusId: undefined,
    executorId: undefined,
    labelId: undefined,
    isCreatorOnly: undefined,
  });

  const { data, loading, error } = useQuery(GET_TASKS, {
    fetchPolicy: 'network-only',
    variables: { filter: activeFilters },
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

  const handleInputChange = (field: string, value: any) => {
    setInputFilters(prev => ({ ...prev, [field]: value }));
  };

  const applyFilters = () => {
    setActiveFilters({
      statusId: inputFilters.statusId || undefined,
      executorId: inputFilters.executorId || undefined,
      labelId: inputFilters.labelId && inputFilters.labelId?.length > 0 ? inputFilters.labelId : undefined,
      isCreatorOnly: inputFilters.isCreatorOnly || undefined,
    });
  };

  return (
    <div>
      <div className="card shadow-sm mb-4 border-0">
        <div className="card-body p-4 bg-light rounded">
          <h5 className="mb-3 text-secondary">Фильтры</h5>
          
          <div className="row g-3 align-items-end">

            <div className="col-12 col-md-3">
              <Form.Label htmlFor="filter-status" className="fw-bold small text-muted">Статус задачи</Form.Label>
              <Form.Select
                id="filter-status"
                value={inputFilters.statusId}
                onChange={(e) => handleInputChange('statusId', e.target.value)}
              >
                <option value="">Все статусы</option>
                {statuses.map((opt) => (
                  <option key={opt.id} value={String(opt.id)}>
                    {opt.label}
                  </option>
                ))}
              </Form.Select>
            </div>

            <div className="col-12 col-md-3">
              <Form.Label htmlFor="filter-executor" className="fw-bold small text-muted">Исполнитель</Form.Label>
              <Form.Select
                id="filter-executor"
                value={inputFilters.executorId}
                onChange={(e) => handleInputChange('executorId', e.target.value)}
              >
                <option value="">Все исполнители</option>
                {users.map((opt) => (
                  <option key={opt.id} value={String(opt.id)}>
                    {opt.label}
                  </option>
                ))}
              </Form.Select>
            </div>

            <div className="col-12 col-md-3">
  <Form.Label className="fw-bold small text-muted mb-2">Лейблы</Form.Label>
  
            <div 
              className="border rounded bg-white p-2" 
              style={{ maxHeight: '150px', overflowY: 'auto' }}
            >
              {labels.length > 0 ? (
                labels.map((opt) => (
                  <Form.Check
                    key={opt.id}
                    type="checkbox"
                    id={`label-${opt.id}`}
                    label={opt.label}
                    value={String(opt.id)}
                    checked={inputFilters.labelId.includes(String(opt.id))} // Проверяем, есть ли ID в массиве
                    onChange={(e) => {
                      const id = String(opt.id);
                      setInputFilters(prev => {
                        const currentLabels = prev.labelId || [];
                        if (e.target.checked) {
                          // Добавляем ID, если галочку поставили
                          return { ...prev, labelId: [...currentLabels, id] };
                        } else {
                          // Убираем ID, если галочку сняли
                          return { ...prev, labelId: currentLabels.filter(item => item !== id) };
                        }
                      });
                    }}
                    className="mb-1"
                  />
                ))
              ) : (
                <div className="text-muted small fst-italic">Нет доступных лейблов</div>
              )}
            </div>
          </div>

            <div className="col-12 col-md-3 d-flex flex-column justify-content-center h-100 pb-2">
              <Form.Check 
                type="switch"
                id="filter-my-tasks"
                label="Показывать только мои задачи"
                checked={inputFilters.isCreatorOnly}
                onChange={(e) => handleInputChange('isCreatorOnly', e.target.checked)}
                className="fs-6"
              />
            </div>

            {/* Кнопка применения */}
            <div className="col-12 col-md-3">
              <Button 
                variant="primary" 
                className="w-100 py-2 fw-semibold"
                onClick={applyFilters}
              >
                Применить фильтры
              </Button>
            </div>
          </div>
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