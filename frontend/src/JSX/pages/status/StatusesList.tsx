import { useMutation, useQuery } from '@apollo/client/react';
import { Spinner, Alert } from 'react-bootstrap';
import { useTranslation } from "react-i18next"

import { DELETE_STATUS, GET_STATUSES, Status } from '../../../graphql/queries';
import { TableConfig, TableList } from '../../components/TableList';

export default function StatusesList() {
  const { t } = useTranslation();
  const { loading, error, data } = useQuery(GET_STATUSES, {
    fetchPolicy: 'network-only',
  });

  const [deleteStatus] = useMutation(DELETE_STATUS, {
    refetchQueries: [
      { query: GET_STATUSES }
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
    await deleteStatus({ variables: { id: id }});
  };

  const addButton = {
    page: 'newStatus',
    label: t('views.statuses.create')
  }

  const statuses = data?.getStatuses || [];

  const columns: TableConfig<Status>['columns'] = [{
    name: 'name',
    label: t('views.statuses.name')
  }];

  const actionButtons = {
    editPageName: 'editStatus',
    deleteAction: handleDelete
  };

  return (
  <TableList
    title={t('views.statuses.status')}
    addButton={addButton}
    columns={columns}
    data={statuses}
    actionButtons={actionButtons}
    >
  </TableList>
  );
}