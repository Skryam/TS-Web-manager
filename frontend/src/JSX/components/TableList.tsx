import { Container, Table, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { formatDate } from "../../utils/formatDate";

type Data = {
  id: string;
  createdAt: string;
} & object;

export interface TableConfig<T extends Data> {
  title: string;

  addButton?: {
    page: string,
    label: string
  };

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

export function TableList<T extends Data>({ title, addButton, columns, data, showActionsIf, actionButtons }: TableConfig<T>) {

   const { editPageName, deleteAction } = actionButtons;
   const navigate = useNavigate();

  return (
    <Container fluid className="mt-4 px-4">
      {/* Шапка: Заголовок слева, кнопка добавления справа */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">{title}</h2>
        {addButton && (
          <Button 
            variant="primary" 
            onClick={() => navigate(`/${addButton.page}`)}
          >
            {addButton.label}
          </Button>
        )}
      </div>

      {/* Таблица без жестких ограничений ширины */}
      <div className="table-responsive bg-white rounded shadow-sm">
        <Table hover striped className="mb-0 align-middle">
          <thead className="table-light">
            <tr>
              <th style={{ width: '60px' }} className="text-center">#</th>
              {columns.map(({ label }, i) => (
                <th key={i}>{label}</th>
              ))}
              <th style={{ width: '150px' }}>Создан</th>
              <th style={{ width: '200px' }} className="text-end">Действия</th>
            </tr>
          </thead>
          <tbody>
            {data.map((entity) => {
              const showActions = showActionsIf ? showActionsIf(entity) : true;
              
              return (
                <tr key={entity.id}>
                  <td className="text-center text-muted fw-bold">{entity.id}</td>
                  
                  {columns.map(({ name }, i) => {
                    const value = entity[name as keyof T];
                    return (
                      <td key={i} className="text-truncate" style={{ maxWidth: '200px' }}>
                        {value ? String(value) : '—'}
                      </td>
                    );
                  })}

                  <td className="text-nowrap text-muted small">
                    {formatDate(entity.createdAt)}
                  </td>

                  {showActions ? (
                    <td className="text-end">
                      <Button 
                        size="sm" 
                        variant="outline-primary" 
                        className="me-2"
                        onClick={() => navigate(`/${editPageName}/${entity.id}`)}
                      >
                        Изм.
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline-danger"
                        onClick={() => deleteAction(entity.id)}
                      >
                        Удал.
                      </Button>
                    </td>
                  ) : (
                    <td></td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    </Container>
  );
}