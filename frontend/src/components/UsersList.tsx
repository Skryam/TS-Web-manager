import { useQuery, useMutation, useApolloClient } from '@apollo/client/react';
import { api } from '../api/client';
import { useEffect } from 'react';
import { GET_USERS, GET_ME, DELETE_USER } from '../graphql/queries';
import { Table, Spinner, Alert, Container } from 'react-bootstrap';
import { formatDate } from '../utils/formatDate';

interface GetUsersData {
  users: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    createdAt: string;
  }[];
};

interface Medata {
  me: {
    id: string;
    email: string;
    firstName: string;
  } | null;
};


export default function UsersList() {
  const client = useApolloClient();
  const { loading, error, data, refetch } = useQuery<GetUsersData>(GET_USERS);
  const [deleteUser] = useMutation(DELETE_USER);
  
  const { data: meData } = useQuery<Medata>(GET_ME);
  const isAuthenticated = !!meData?.me;
  console.log(isAuthenticated)

  const handleDelete = async (id) => {
    try {
      await deleteUser({ variables: { id: id }})
      await client.resetStore();
      navigate('/');
    } catch (err) {
      console.log(err)
    }
  };
  
  useEffect(() => {
    const handleFocus = () => {
      refetch();
    };
    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    }
  }, [refetch]);

  if (loading) return <Spinner animation="border" role="status" />;
  if (error) return <Alert variant="danger">Ошибка: {error.message}</Alert>;
  if (!data) return null;

  return (
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
                <>
                  <button className="btn btn-primary me-1" onClick={handleLogout}>Редактировать</button>
                  <button className="btn btn-danger" onClick={handleDelete}>Удалить</button>
                </>
              ) : null}
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}