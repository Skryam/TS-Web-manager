import { Container, Table, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next"

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
    render?: (...options) => React.ReactNode
  }>;

  data: Array<T>;

  showActionsIf?: (entity: T) => boolean;

  actionButtons: {
    editPageName: string;
    deleteAction: (id: string) => Promise<void> | void;
  }
}

export function TableList<T extends Data>({ title, addButton, columns, data, showActionsIf, actionButtons }: TableConfig<T>) {

   const { t } = useTranslation();
   const { editPageName, deleteAction } = actionButtons;
   const navigate = useNavigate();

   const [error, setError] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setError(null);
    try {
      await deleteAction(id);
    } catch (err: any) {
      let userMessage = t('components.tableList.deleteError');

      if (err?.message?.includes("RESTRICT")) {
        userMessage = t('components.tableList.restrictError');
      } else {
        userMessage = userMessage || err.message || userMessage;
      }

      setError(userMessage);
    }
  };

  return (
    <Container fluid className="mt-4 px-4">
      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          <strong>Ошибка:</strong> {error}
        </Alert>
      )}

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

      <div className="table-responsive bg-white rounded shadow-sm">
        <Table hover striped className="mb-0 align-middle">
          <thead className="table-light">
            <tr>
              <th style={{ width: '60px' }} className="text-center">#</th>
              {columns.map(({ label }, i) => (
                <th key={i}>{label}</th>
              ))}
              <th style={{ width: '150px' }}>{t('components.tableList.created')}</th>
              <th style={{ width: '200px' }} className="text-end">{t('components.tableList.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {data.map((entity) => {
              const showActions = showActionsIf ? showActionsIf(entity) : true;
              
              return (
                <tr key={entity.id}>
                  <td className="text-center text-muted fw-bold">{entity.id}</td>
                  
                  {columns.map(({ name, render }, i) => {
                    const value = entity[name as keyof T];

                    return (
                      <td key={i} className="text-truncate" style={{ maxWidth: '200px' }}>
                        {render
                          ? render(entity.id, value)
                          : (value ? String(value) : '—')
                        }
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
                        {t('components.tableList.edit')}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline-danger"
                        onClick={() => handleDelete(entity.id)}
                      >
                        {t('components.tableList.delete')}
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