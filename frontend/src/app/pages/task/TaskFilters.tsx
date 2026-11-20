// components/TaskFilters.tsx
import { memo } from 'react';
import { Button, Form, Card } from 'react-bootstrap';
import { useQuery } from '@apollo/client/react';
import { useTranslation } from 'react-i18next';
import { useForm, FormProvider } from 'react-hook-form';

import { TaskFilterInput } from '../../../graphql/queries/tasks';
import { GET_STATUSES } from '../../../graphql/queries/statuses';
import { GET_USERS } from '../../../graphql/queries/users';
import { GET_LABELS } from '../../../graphql/queries/labels';
import { SelectInput } from '../../components/SelectInput';
import { SubmitButton } from '../../components/SubmitButton';

interface TaskFiltersProps {
  onApply: (filters: TaskFilterInput) => void;
}

type FilterFormValues = {
  statusId: string;
  executorId: string;
  labelId: string[];
  isCreatorOnly: boolean;
};

export const TaskFilters = memo(function TaskFilters({ onApply }: TaskFiltersProps) {
  const { t } = useTranslation();

  const methods = useForm<FilterFormValues>({
    defaultValues: {
      statusId: '',
      executorId: '',
      labelId: [],
      isCreatorOnly: false,
    },
  });

  const { handleSubmit, reset } = methods;

  const { data: statusesData } = useQuery(GET_STATUSES);
  const statuses =
    statusesData?.getStatuses?.map((s) => ({ id: String(s.id), label: s.name })) ?? [];

  const { data: usersData } = useQuery(GET_USERS);
  const users =
    usersData?.getUsers?.map((u) => ({
      id: String(u.id),
      label: `${u.firstName} ${u.lastName}`,
    })) ?? [];

  const { data: labelsData } = useQuery(GET_LABELS);
  const labels =
    labelsData?.getLabels?.map((l) => ({ id: String(l.id), label: l.name })) ?? [];

  const onSubmit = (data: FilterFormValues) => {
    onApply({
      statusId: data.statusId || undefined,
      executorId: data.executorId || undefined,
      labelId: data.labelId?.length ? data.labelId : undefined,
      isCreatorOnly: data.isCreatorOnly || undefined,
    });
  };

  return (
    <Card className="shadow-sm mb-4 border-0">
      <Card.Body className="p-4 bg-light rounded">
        <h5 className="mb-3 text-secondary">{t('views.tasks.filter.title')}</h5>

        <FormProvider {...methods}>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <div className="row g-3">
              <div className="col-12 col-md-3">
                <SelectInput
                  fieldName="statusId"
                  label="views.tasks.filter.status"
                  options={statuses}
                  placeholder={t('views.tasks.filter.statusHolder')}
                />
              </div>

              <div className="col-12 col-md-3">
                <SelectInput
                  fieldName="executorId"
                  label="views.tasks.filter.executor"
                  options={users}
                  placeholder={t('views.tasks.filter.executorHolder')}
                />
              </div>

              <div className="col-12 col-md-3">
                <SelectInput
                  fieldName="labelId"
                  label="views.tasks.filter.labels"
                  options={labels}
                  placeholder={t('views.tasks.filter.noLabels')}
                  multiple
                />
              </div>

              <div className="col-12 col-md-3 d-flex flex-column justify-content-end">
                <Form.Check
                  type="switch"
                  id="isCreatorOnly"
                  label={t('views.tasks.filter.showMyTasks')}
                  {...methods.register('isCreatorOnly')}
                  className="mb-3"
                />
              </div>

              <div className="col-12 d-flex gap-2">
                <SubmitButton />
                <Button
                  type="button"
                  variant="outline-secondary"
                  onClick={() => reset()}
                >
                  {t('views.tasks.filter.reset')}
                </Button>
              </div>
            </div>
          </Form>
        </FormProvider>
      </Card.Body>
    </Card>
  );
});