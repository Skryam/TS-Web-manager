import { useMutation, useQuery } from '@apollo/client/react';
import { Spinner, Alert } from 'react-bootstrap';

import { GET_LABELS, DELETE_LABEL, Label } from '../../../graphql/queries';
import { TableConfig, TableList } from '../../components/TableList';

export default function LabelsList() {
  const { loading, error, data } = useQuery(GET_LABELS, {
    fetchPolicy: 'network-only',
  });

  const [deleteLabel] = useMutation(DELETE_LABEL, {
    refetchQueries: [
      { query: GET_LABELS }
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
      await deleteLabel({ variables: { id: id }});
    } catch (err) {
      console.log(err)
    }
  };

  const addButton = {
    page: 'newLabel',
    label: 'Добавить лейбл'
  }

  const labels = data?.getLabels || [];

  const columns: TableConfig<Label>['columns'] = [{
    name: 'name',
    label: 'Название',
  }];

  const actionButtons = {
    editPageName: 'editLabel',
    deleteAction: handleDelete
  };

  return (
  <TableList
    title='Лейблы'
    addButton={addButton}
    columns={columns}
    data={labels}
    actionButtons={actionButtons}
    >
  </TableList>
  );
}