import { useMutation, useQuery } from '@apollo/client/react';
import { Spinner, Alert } from 'react-bootstrap';

import { DELETE_STATUS, GET_STATUSES, Status } from '../../../graphql/queries';
import { TableConfig, TableList } from '../../components/TableList';

export default function StatusesList() {
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
    try {
      await deleteStatus({ variables: { id: id }});
    } catch (err) {
      console.log(err)
    }
  };

  const addButton = {
    page: 'newStatus',
    label: 'Добавить статус'
  }

  const statuses = data?.getStatuses || [];

  const columns: TableConfig<Status>['columns'] = [{
    name: 'name',
    label: 'Название',
  }];

  const actionButtons = {
    editPageName: 'editStatus',
    deleteAction: handleDelete
  };

  return (
  <TableList
    title='Статусы'
    addButton={addButton}
    columns={columns}
    data={statuses}
    actionButtons={actionButtons}
    >
  </TableList>
  );
}