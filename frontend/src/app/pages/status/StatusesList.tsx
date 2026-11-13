import { useMutation, useQuery } from '@apollo/client/react';
import { useTranslation } from 'react-i18next';

import { DELETE_STATUS, GET_STATUSES, Status } from '../../../graphql/queries/statuses';
import { TableConfig, TableList } from '../../components/TableList';
import { QueryResult } from '../../components/QueryResult';
import { useRun } from '../../components/Run';

export default function StatusesList() {
  const run = useRun();
  const { t } = useTranslation();
  const { loading, error, data } = useQuery(GET_STATUSES, {
    fetchPolicy: 'network-only',
  });

  const [deleteStatus] = useMutation(DELETE_STATUS, {
    refetchQueries: [{ query: GET_STATUSES }],
  });

  const handleDelete = async (id: string) => 
    run(() => deleteStatus({ variables: { id } }), {
      sucessKey: 'flash.statuses.delete.success',
      errorKey: 'flash.statuses.delete.error',
    });

  const addButton = {
    page: 'statuses/create',
    label: t('views.statuses.create'),
  };

  const statuses = data?.getStatuses || [];

  const columns: TableConfig<Status>['columns'] = [
    {
      name: 'name',
      label: t('views.statuses.name'),
    },
  ];

  const actionButtons = {
    editPageName: 'statuses',
    deleteAction: handleDelete,
  };

  return (
    <QueryResult loading={loading} error={error} data={data}>
      <TableList
        title={t('views.statuses.status')}
        addButton={addButton}
        columns={columns}
        data={statuses}
        actionButtons={actionButtons}
      ></TableList>
    </QueryResult>
  );
}
