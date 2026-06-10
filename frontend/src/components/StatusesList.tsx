import { useQuery } from '@apollo/client/react';
import { GET_STATUSES } from '../graphql/queries';
import { Table, Spinner, Alert, Container } from 'react-bootstrap';

interface GetStatusesData {
  statuses: {
    id: string;
    name: string;
  }[];
}

export default function StatusesList() {
  const { loading, error, data } = useQuery<GetStatusesData>(GET_STATUSES, {
    fetchPolicy: 'network-only',
  });

  if (loading) return <Spinner animation="border" role="status" />;
  if (error) return <Alert variant="danger">Ошибка: {error.message}</Alert>;
  if (!data) return null;
  console.log(data)

  return (
    <Container className="mt-4 d-flex justify-content-center">
    <div style={{ maxWidth: '600px', width: '100%' }}> 
      <h2 className="text-center mb-4">Статусы</h2>
      
      <Table striped bordered hover className="bg-white shadow-sm rounded">
        <thead className="table-gray">
          <tr>
            {/* Фиксируем ширину ID, чтобы она была узкой */}
            <th style={{ width: '50px' }} className="text-center">ID</th>
            <th>Название</th>
          </tr>
        </thead>
        <tbody>
          {data.statuses.map((status) => (
            <tr key={status.id}>
              <td className="text-center align-middle">{status.id}</td>
              <td className="align-middle">{status.name}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
    </Container>
  );
}