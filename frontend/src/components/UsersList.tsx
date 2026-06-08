import { useQuery } from '@apollo/client/react';
import { useEffect } from 'react';
import { GET_USERS } from '../graphql/queries';
import { Table, Spinner, Alert, Container } from 'react-bootstrap';

interface GetUsersData {
  users: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  }[];
}

export default function UsersList() {
  const { loading, error, data, refetch } = useQuery<GetUsersData>(GET_USERS);
  
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
          </tr>
        </thead>
        <tbody>
          {data.users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.email}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}