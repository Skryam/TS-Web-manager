import { useState, memo } from "react";
import { Form, Button } from 'react-bootstrap';

import { GET_LABELS, GET_STATUSES, GET_USERS, TaskFilterInput } from "../../../graphql/queries";
import { useTranslation } from "react-i18next";
import { useQuery } from "@apollo/client/react";

interface TaskFiltersProps {
  onApply: (filters: TaskFilterInput) => void;
}

export const TaskFilters = memo(function TaskFilters({ onApply }: TaskFiltersProps) {
  const { t } = useTranslation();

  
  const [inputFilters, setInputFilters] = useState<TaskFilterInput>({
      statusId: '',
      executorId: '',
      labelId: [],
      isCreatorOnly: false,
    });

  const { data: statusesData } = useQuery(GET_STATUSES);
  const statuses =
    statusesData?.getStatuses?.map((s) => ({
      id: s.id,
      label: s.name,
    })) ?? [];

  const { data: usersData } = useQuery(GET_USERS);
  const users =
    usersData?.getUsers?.map((u) => ({
      id: u.id,
      label: `${u.firstName} ${u.lastName}`,
    })) ?? [];

  const { data: labelsData } = useQuery(GET_LABELS);
  const labels =
    labelsData?.getLabels.map((l) => ({
      id: l.id,
      label: l.name,
    })) ?? [];

  const applyFilters = () => {
    onApply({
      statusId: inputFilters.statusId || undefined,
      executorId: inputFilters.executorId || undefined,
      labelId: inputFilters.labelId?.length ? inputFilters.labelId : undefined,
      isCreatorOnly: inputFilters.isCreatorOnly || undefined,
    });
  };

  const handleInputChange = (field: string, value: any) => {
    setInputFilters((prev) => ({ ...prev, [field]: value }));
  };

  console.log('КОМПОНЕНТ');

  return (
    <div className="card shadow-sm mb-4 border-0">
    <div className="card-body p-4 bg-light rounded">
      <h5 className="mb-3 text-secondary">{t('views.tasks.filter.title')}</h5>

      <div className="row g-3">
        <div className="col-12 col-md-3">
          <Form.Label htmlFor="filter-status" className="fw-bold small text-muted">
            {t('views.tasks.filter.status')}
          </Form.Label>
          <Form.Select
            id="filter-status"
            value={inputFilters.statusId}
            onChange={(e) => handleInputChange('statusId', e.target.value)}
          >
            <option value="">{t('views.tasks.filter.statusHolder')}</option>
            {statuses.map((opt) => (
              <option key={opt.id} value={String(opt.id)}>
                {opt.label}
              </option>
            ))}
          </Form.Select>
        </div>

        <div className="col-12 col-md-3">
          <Form.Label htmlFor="filter-executor" className="fw-bold small text-muted">
            {t('views.tasks.filter.executor')}
          </Form.Label>
          <Form.Select
            id="filter-executor"
            value={inputFilters.executorId}
            onChange={(e) => handleInputChange('executorId', e.target.value)}
          >
            <option value="">{t('views.tasks.filter.executorHolder')}</option>
            {users.map((opt) => (
              <option key={opt.id} value={String(opt.id)}>
                {opt.label}
              </option>
            ))}
          </Form.Select>
        </div>

        <div className="col-12 col-md-3 d-flex flex-column">
          <Form.Label className="fw-bold small text-muted mb-2">
            {t('views.tasks.filter.labels')}
          </Form.Label>

          <div
            className="border rounded bg-white p-2 flex-grow-1"
            style={{ maxHeight: '150px', overflowY: 'auto' }}
          >
            {labels.length > 0 ? (
              labels.map((opt) => (
                <Form.Check
                  key={opt.id}
                  type="checkbox"
                  id={`label-${opt.id}`}
                  label={opt.label}
                  value={String(opt.id)}
                  checked={
                    inputFilters?.labelId && inputFilters?.labelId.includes(String(opt.id))
                  } // Проверяем, есть ли ID в массиве
                  onChange={(e) => {
                    const id = String(opt.id);
                    setInputFilters((prev) => {
                      const currentLabels = prev.labelId || [];
                      if (e.target.checked) {
                        // Добавляем ID, если галочку поставили
                        return { ...prev, labelId: [...currentLabels, id] };
                      } else {
                        // Убираем ID, если галочку сняли
                        return {
                          ...prev,
                          labelId: currentLabels.filter((item) => item !== id),
                        };
                      }
                    });
                  }}
                  className="mb-1"
                />
              ))
            ) : (
              <div className="text-muted small fst-italic">
                {t('views.tasks.filter.noLabels')}
              </div>
            )}
          </div>
        </div>

        <div className="col-12 col-md-3 d-flex flex-column justify-content-center h-100 pb-2">
          <Form.Check
            type="switch"
            id="filter-my-tasks"
            label={t('views.tasks.filter.showMyTasks')}
            checked={inputFilters.isCreatorOnly}
            onChange={(e) => handleInputChange('isCreatorOnly', e.target.checked)}
            className="fs-6"
          />
        </div>

        {/* Кнопка применения */}
        <div className="col-12 col-md-3">
          <Button variant="primary" className="w-100 py-2 fw-semibold" onClick={applyFilters}>
            {t('views.tasks.filter.applyFilters')}
          </Button>
        </div>
      </div>
    </div>
  </div>
  )
});