import { Container, Table } from "react-bootstrap";

interface BaseTableItem {
  id: string;
  createdAt: string;
}

interface DataTable<T extends BaseTableItem> {
  data: T[];
  columns: 
}

export const TableList = (data) => {

  { id } = data;
  { createdAt } = data;

  return (
    <Container className="mt-4 d-flex justify-content-center">
      <div style={{ maxWidth: '600px', width: '100%' }}> 
        <h2 className="text-center mb-4">{title}</h2>
        
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
  )
}