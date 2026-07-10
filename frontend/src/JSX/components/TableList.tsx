import { Container, Table, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { formatDate } from "../../utils/formatDate";

type Data = {
  id: string;
  createdAt: string;
} & object;

export interface TableConfig<T extends Data> {
  title: string;

  columns: Array<{
    name: string;
    label: string;
  }>;

  data: Array<T>;

  showActionsIf?: (entity: T) => boolean;

  actionButtons: {
    editPageName: string;
    deleteAction: (id: string) => void;
  }
}

export function TableList<T extends Data>({ title, columns, data, showActionsIf, actionButtons }: TableConfig<T>) {

   const { editPageName, deleteAction } = actionButtons;
   const navigate = useNavigate();

  return (
    <Container className="mt-4 d-flex justify-content-center">
      <div style={{ maxWidth: '600px', width: '100%' }}> 
        <h2 className="text-center mb-4">{title}</h2>
        
        <Table striped bordered hover className="bg-white shadow-sm rounded">
          <thead className="table-gray">
            <tr>
              <th style={{ width: '50px' }} className="text-center">ID</th>
              {columns.map(({ label }, ind) => {
                return <th key={ind}>{label}</th>
              })}
              <th>Дата создания</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.map((entity) => {

              const { id } = entity;
              const showActionButtons = showActionsIf ? showActionsIf(entity) : true

              return (
              <tr key={entity.id}>
                <td className="text-center align-middle">{id}</td>

                {columns.map(({name}) => {

                  const value = entity[name as keyof T];

                  if (!value) {
                    return null;
                  }
                  return <td className="align-middle">{String(value)}</td>
                })}

                <td className='align-middle'>{formatDate(entity.createdAt)}</td>

                {showActionButtons &&
                  <td>
                    <div className='d-flex flex-wrap'>
                      <Button className="btn btn-primary me-2" onClick={() => navigate(`/${editPageName}/${id}`)}>Редактировать</Button>
                      <Button className="btn btn-danger" onClick={() => deleteAction(id)}>Удалить</Button>
                    </div>
                  </td>
                }
              </tr>
              )
            }
            )}
          </tbody>
        </Table>

      </div>
    </Container>
  )
}