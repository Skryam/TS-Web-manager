import { useMutation, useQuery } from '@apollo/client/react';
import { Spinner, Alert, Badge } from 'react-bootstrap';
import { useState, useCallback, SetStateAction } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import {
  DELETE_TASK,
  GET_TASKS,
  Task,
  TaskFilterInput,
} from '../../../graphql/queries';
import { TableConfig, TableList } from '../../components/TableList';
import { useFlash } from '../../components/FlashProvider';
import { usePageErrorContext } from '../../context/PageErrorContext';
import { TaskFilters } from './TaskFilters';

interface TaskTableProps {
  activeFilters: TaskFilterInput
}

export default function TasksTable({activeFilters}: TaskTableProps) {
  const flash = useFlash();
  const { t } = useTranslation();
  const {setError} = usePageErrorContext();

  const { data, loading, error } = useQuery(GET_TASKS, {
    fetchPolicy: 'network-only',
    variables: { filter: activeFilters },
  });

  const [deleteTask] = useMutation(DELETE_TASK);

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
      await deleteTask({
        variables: { id: id },
        refetchQueries: [
          { query: GET_TASKS, variables: { filter: activeFilters } },
        ]
      });
      flash(t('flash.tasks.delete.success'));
    } catch (err: any) {
      flash(t('flash.tasks.delete.error'));
      setError(err)
    }
  };

  const addButton = {
    page: 'newTask',
    label: t('views.tasks.create'),
  };

  const tasks = data?.getTasks
    ? data.getTasks.map(
        ({ id, name, description, status, executor, creator, labels, createdAt }) => ({
          id,
          name,
          description,
          status: status.name,
          executor: executor ? `${executor.firstName} ${executor.lastName}` : null,
          creator: `${creator.firstName} ${creator.lastName}`,
          labels,
          createdAt,
        }),
      )
    : [];

  const columns: TableConfig<Task>['columns'] = [
    {
      name: 'name',
      label: t('views.tasks.name'),
      render: (id, value) => (
        <Link to={`/viewTask/${id}`} className="link">
          {String(value)}
        </Link>
      ),
    },
    {
      name: 'description',
      label: t('views.tasks.description'),
    },
    {
      name: 'status',
      label: t('views.tasks.status'),
    },
    {
      name: 'executor',
      label: t('views.tasks.executor'),
    },
    {
      name: 'labels',
      label: t('views.tasks.labels'),
      render: (id, value) =>
        value.map((label) => (
          <Badge key={label.name} bg="info" className="me-1 text-white">
            {label.name}
          </Badge>
        )),
    },
  ];

  const actionButtons = {
    editPageName: 'editTask',
    deleteAction: handleDelete,
  };

  return (
    <TableList
      title={t('views.tasks.title')}
      addButton={addButton}
      columns={columns}
      data={tasks}
      actionButtons={actionButtons}
    />
  );
}