import { useQuery, useMutation } from '@apollo/client/react';
import { Spinner, Alert } from 'react-bootstrap';

import { User, GET_ME, GET_USERS, DELETE_USER } from '../../graphql/queries';
import { TableList, TableConfig } from '../components/TableList';

export default function UsersList() {
  const { data: meData } = useQuery(GET_ME);

  const { loading, error, data } = useQuery(GET_USERS, { fetchPolicy: 'network-only' });

  const [deleteUser] = useMutation(DELETE_USER, {
    refetchQueries: [
      { query: GET_USERS },
      { query: GET_ME }
    ],
  });

  const handleDelete = async (id: string) => {
    try {
      await deleteUser({ variables: { id: id }});
    } catch (err) {
      console.log(err)
    }
  };

  if (loading) {
    return <Spinner animation="border" role="status" />;
  }
  if (error) {
    return <Alert variant="danger">Ошибка: {error.message}</Alert>;
  }
  if (!data) {
    return null;
  }

  const users = data?.users || [];

  const columns: TableConfig<User>['columns'] = [
    {
      name: 'firstName',
      label: 'Имя',
    },
    {
      name: 'lastName',
      label: 'Фамилия',
    },
    {
      name: 'email',
      label: 'email',
    } ,
  ];

  const actionButtons = {
    editPageName: 'editUser',
    deleteAction: handleDelete
  };

  return (
    <TableList
      title='Пользователи'
      columns={columns}
      data={users}
      showActionsIf={(user) => meData?.me?.id === user.id}
      actionButtons={actionButtons}
      >
    </TableList>
  );
}