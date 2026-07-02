import { useQuery, useMutation } from '@apollo/client/react';
import { useNavigate } from 'react-router-dom';
import { Table, Spinner, Alert, Container } from 'react-bootstrap';

import { GET_USERS, GET_ME, DELETE_USER } from '../../graphql/queries';
import { TableList, TableConfig } from '../components/TableList';
import { formatDate } from '../../utils/formatDate';

export default function UsersList() {
  const navigate = useNavigate();
  const { loading, error, data } = useQuery(GET_USERS, { fetchPolicy: 'network-only' });
  const [deleteUser] = useMutation(DELETE_USER, {
    refetchQueries: [
      { query: GET_USERS },
      { query: GET_ME }
    ],
  });
  
  const { data: meData } = useQuery(GET_ME);
  const isAuthenticated = !!meData?.me;
  console.log(isAuthenticated)

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

  const TableConfig: TableConfig = {
    title: 
  }

  return (
    <TableList>

    </TableList>


    <Container className="mt-4">
      <h2>Пользователи</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Имя</th>
            <th>Фамилия</th>
            <th>Email</th>
            <th>Дата создания</th>
          </tr>
        </thead>
        <tbody>
          {data.users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.email}</td>
              <td>{formatDate(user.createdAt)}</td>
              {isAuthenticated && meData.me?.id === user.id ? (
                <td>
                <div className='d-flex flex-wrap'>
                  <button className="btn btn-primary me-2" onClick={() => navigate(`/editUser/${user.id}`)}>Редактировать</button>
                  <button className="btn btn-danger" onClick={() => handleDelete(user.id)}>Удалить</button>
                </div>
              </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}