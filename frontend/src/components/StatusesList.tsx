import { useQuery } from '@apollo/client/react';
import { GET_STATUSES } from '../graphql/queries';
import { useNavigate } from 'react-router-dom';
import { Table, Spinner, Alert, Container } from 'react-bootstrap';
import { formatDate } from '../utils/formatDate';

interface GetStatusesData {
  statuses: {
    id: string;
    name: string;
    createdAt: string;
  }[];
}

export default function StatusesList() {
  const navigate = useNavigate();
  const { loading, error, data } = useQuery<GetStatusesData>(GET_STATUSES, {
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

  return (
    <Container className="mt-4 d-flex justify-content-center">
    <div style={{ maxWidth: '600px', width: '100%' }}> 
      <h2 className="text-center mb-4">Статусы</h2>
      <button className="btn btn-primary mb-3" onClick={() => navigate('/newStatus')}>Добавить статус</button>
      
      <Table striped bordered hover className="bg-white shadow-sm rounded">
        <thead className="table-gray">
          <tr>
            <th style={{ width: '50px' }} className="text-center">ID</th>
            <th>Название</th>
            <th>Дата создания</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data.statuses.map((status) => (
            <tr key={status.id}>
              <td className="text-center align-middle">{status.id}</td>
              <td className="align-middle">{status.name}</td>
              <td className='align-middle'>{formatDate(status.createdAt)}</td>
              <td>
                <div className='d-flex flex-wrap'>
                  <button className="btn btn-primary me-2" onClick={() => navigate(`/editStatus/${status.id}`)}>Редактировать</button>
                  <button className="btn btn-danger" onClick={() => console.log(1)}>Удалить</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
    </Container>
  );
}