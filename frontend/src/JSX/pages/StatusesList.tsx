import { useQuery } from '@apollo/client/react';
import { useNavigate } from 'react-router-dom';
import { Table, Spinner, Alert, Container } from 'react-bootstrap';

import { GET_STATUSES, Status } from '../../graphql/queries';
import { formatDate } from '../../utils/formatDate';
import { TableConfig, TableList } from '../components/TableList';

export default function StatusesList() {
  const navigate = useNavigate();
  const { loading, error, data } = useQuery(GET_STATUSES, {
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

  const statuses = data?.statuses || [];

  const columns: TableConfig<Status>['columns'] = [{
    name: 'name',
    label: 'Название',
  }];

  const actionButtons = [
    {
      editPageName: 'editStatus',
      deleteAction: () => console.log(1)
    },
  ];

  return (
  <TableList
    title='Добавить статус'
    columns={columns}
    data={statuses}
    actionButtons={actionButtons}
    >
  </TableList>
  );
}