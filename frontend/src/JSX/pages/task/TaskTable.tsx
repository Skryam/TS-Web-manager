import { useMutation, useQuery } from '@apollo/client/react';
import { Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import {
  DELETE_TASK,
  GET_TASKS,
  TaskFilterInput,
} from '../../../graphql/queries/task';
import { TableConfig, TableList } from '../../components/TableList';
import { QueryResult } from '../../components/QueryResult';
import { useRun } from '../../components/Run';

interface TaskTableProps {
  activeFilters: TaskFilterInput
}

export default function TasksTable({activeFilters}: TaskTableProps) {
  const run = useRun();
  const { t } = useTranslation();

  const { data, loading, error } = useQuery(GET_TASKS, {
    fetchPolicy: 'network-only',
    variables: { filter: activeFilters },
  });

  const [deleteTask] = useMutation(DELETE_TASK, {
    refetchQueries: [{ query: GET_TASKS, variables: { filter: activeFilters } }],
  });

  const handleDelete = async (id: string) =>
    run(() => deleteTask({ variables: { id } }), {
      sucessKey: 'flash.tasks.delete.success',
      errorKey: 'flash.tasks.delete.error',
    });

  const addButton = {
    page: '/tasks/create',
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
        <Link to={`/tasks/${id}`} className="link">
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
    editPageName: 'tasks',
    deleteAction: handleDelete,
  };

  return (
     <QueryResult loading={loading} error={error} data={data}>
      <TableList
        title={t('views.tasks.title')}
        addButton={addButton}
        columns={columns}
        data={tasks}
        actionButtons={actionButtons}
      ></TableList>
    </QueryResult>
  );
}