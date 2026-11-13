import { useMutation, useQuery } from '@apollo/client/react';
import { useTranslation } from 'react-i18next';

import { TableConfig, TableList } from '../../components/TableList';
import { DELETE_LABEL, GET_LABELS, Label } from '../../../graphql/queries/labels';
import { useRun } from '../../components/Run';
import { QueryResult } from '../../components/QueryResult';

export default function LabelsList() {
  const run = useRun();
  const { t } = useTranslation();
  const { loading, error, data } = useQuery(GET_LABELS, {
    fetchPolicy: 'network-only',
  });

  const [deleteLabel] = useMutation(DELETE_LABEL, {
    refetchQueries: [{ query: GET_LABELS }],
  });

  const handleDelete = async (id: string) => 
    run(() => deleteLabel({ variables: { id } }), {
      sucessKey: 'flash.labels.delete.success',
      errorKey: 'flash.labels.delete.error',
    });

  const addButton = {
    page: 'labels/create',
    label: 'views.labels.create',
  };

  const labels = data?.getLabels || [];

  const columns: TableConfig<Label>['columns'] = [
    {
      name: 'name',
      label: 'views.labels.name',
    },
  ];

  const actionButtons = {
    editPageName: 'labels',
    deleteAction: handleDelete,
  };

  return (
    <QueryResult loading={loading} error={error} data={data}>
      <TableList
        title={t('views.labels.title')}
        addButton={addButton}
        columns={columns}
        data={labels}
        actionButtons={actionButtons}
      ></TableList>
    </QueryResult>
  );
}
