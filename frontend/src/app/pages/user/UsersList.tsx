import { useQuery, useMutation } from '@apollo/client/react';

import { User, GET_ME, GET_USERS, DELETE_USER } from '../../../graphql/queries/users';
import { TableList, TableConfig } from '../../components/TableList';
import { QueryResult } from '../../components/QueryResult';
import { useRun } from '../../components/Run';

export default function UsersList() {
  const run = useRun();
  const { data: meData } = useQuery(GET_ME);

  const { loading, error, data } = useQuery(GET_USERS, { fetchPolicy: 'network-only' });

  const [deleteUser] = useMutation(DELETE_USER, {
    refetchQueries: [{ query: GET_USERS }, { query: GET_ME }],
  });

  const handleDelete = async (id: string) =>
    run(() => deleteUser({ variables: { id } }), {
      sucessKey: 'flash.users.delete.success',
      errorKey: 'flash.users.delete.error',
    });

  const users = data?.getUsers
    ? data.getUsers.map((u) => ({
      ...u,
      fullName: `${u.firstName} ${u.lastName}`,
    }))
    : [];
  console.log(users);

  const columns: TableConfig<User>['columns'] = [
    {
      name: 'fullName',
      label: 'views.users.fullName',
    },
    {
      name: 'email',
      label: 'views.users.email',
    },
  ];

  const actionButtons = {
    editPageName: 'users',
    deleteAction: handleDelete,
  };

  return (
    <QueryResult loading={loading} error={error} data={data}>
      <TableList
        title={'views.users.title'}
        columns={columns}
        data={users}
        showActionsIf={(user) => meData?.me?.id === user.id}
        actionButtons={actionButtons}
      ></TableList>
    </QueryResult>
  );
}
