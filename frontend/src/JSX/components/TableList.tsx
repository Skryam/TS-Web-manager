import { Container, Table } from "react-bootstrap";
import { formatDate } from "../../utils/formatDate";

type Data = {
  id: string;
  createdAt: string;
} & object;

export interface TableConfig<T extends Data> {
  columns: Array<{
    name: string;
    label: string;
  }>;
  data: Array<T>;
  actionButtons: Array<{
    type: 'primary' | 'danger',
    label: string;
    action: () => void;
  }>
}

export const TableList<T> = (config: TableConfig<T>) => {
  const defaultIdColumn = {
    name: 'id',
    label: 'ID'
  };

  const defaultCreatedAtColumn = {
    name:' createdAt',
    label: 'Created At',
  };

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
              {config.columns.map}
              <th>Дата создания</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.statuses.map((entity) => (
              <tr key={entity.id}>
                <td className="text-center align-middle">{entity.id}</td>

                {config.columns.map(({name}) => {
                  if (!entity[name]) {
                    return null;
                  }

                  return <td className="align-middle">{entity[name]}</td>
                })}
                <td className="align-middle">{entity.name}</td>

                <td className='align-middle'>{formatDate(status.createdAt)}</td>
                {config.actionButtons.length
                  && <td>
                  <div className='d-flex flex-wrap'>
                    {config.actionButtons}
                    <button className="btn btn-{name} me-2" onClick={() => action}>{label}</button>
                  </div>
                </td>}
              </tr>
            ))}
          </tbody>
        </Table>

      </div>
    </Container>
  )
}