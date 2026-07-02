import { Container, Table, Button } from "react-bootstrap";

import { formatDate } from "../../utils/formatDate";

type Data = {
  id: string;
  createdAt: string;
} & object;

export interface TableConfig<T extends Data> {
  title: string;

  columns: Array<{
    name: keyof T;
    label: string;
  }>;

  data: Array<T>;

  actionButtons: Array<{
    type: 'primary' | 'danger';
    label: string;
    action: () => void;
  }>
}

export function TableList<T extends Data>({ title, columns, data, actionButtons }: TableConfig<T>) {

  return (
    <Container className="mt-4 d-flex justify-content-center">
      <div style={{ maxWidth: '600px', width: '100%' }}> 
        <h2 className="text-center mb-4">{title}</h2>
        
        <Table striped bordered hover className="bg-white shadow-sm rounded">
          <thead className="table-gray">
            <tr>
              <th style={{ width: '50px' }} className="text-center">ID</th>
              {columns.map(({ label }) => {
                return <th>{label}</th>
              })}
              <th>Дата создания</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.map((entity) => (
              <tr key={entity.id}>
                <td className="text-center align-middle">{entity.id}</td>

                {columns.map(({name}) => {
                  if (!entity[name]) {
                    return null;
                  }
                  return <td className="align-middle">{String(entity[name])}</td>
                })}

                <td className='align-middle'>{formatDate(entity.createdAt)}</td>

                {actionButtons.length &&
                <td>
                  <div className='d-flex flex-wrap'>
                    {actionButtons.map(({ type, label, action }) => {
                      return <Button className={`btn btn-${type} me-2`} onClick={() => action}>{label}</Button>
                    })}
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