import { useQuery } from "@apollo/client/react";
import { Link, useParams } from "react-router-dom";
import { Alert, Spinner, Badge } from "react-bootstrap";
import { useTranslation } from "react-i18next";


import { formatDate } from "../../../utils/formatDate";
import { GET_TASK_BY_ID } from "../../../graphql/queries";

export default function ViewTask() {
  const { t } = useTranslation();
  const { id } = useParams();

  const { error, data, loading } = useQuery(GET_TASK_BY_ID, {
    variables: { id },
    skip: !id,
  });

  if (loading) {
    return <Spinner animation="border" role="status" />;
  }
  if (error) {
    return <Alert variant="danger">Ошибка: {error.message}</Alert>;
  }
  if (!data?.getTask) {
    return <div>Задача не найдена</div>;
  }

  const task = data.getTask;
  console.log(task)

  return (
    <>
      <h2 className="display-4 fw-bold mt-4">{task.name}</h2>
      
      <div className="row mt-5 p-5 shadow bg-white">

        <div className="col-12 col-md-8 order-2 order-md-1">
          <p className="lead fw-normal mb-4">{task.description}</p>
        </div>

        <div className="col-12 col-md-4 border-start px-3 order-1 order-md-2 mb-3 mb-md-0">
          
          <div className="mb-2">
            <Badge bg="danger" className="me-1 text-white">
              {task.status.name}
            </Badge>
            
            {task.labels?.map((label) => (
              <Badge key={label.name} bg="info" className="me-1 text-white">
                {label.name}
              </Badge>
            ))}
          </div>

          <div className="d-flex flex-wrap mb-3">
            <span className="text-muted me-2">{t('views.tasks.view.creator')}:</span>
            <span>{`${task.creator.firstName} ${task.creator.lastName}`}</span>
          </div>

          <div className="d-flex flex-wrap mb-3">
            <span className="text-muted me-2">{t('views.tasks.view.executor')}:</span>
            <span>{task.executor?.firstName ? `${task.executor.firstName} ${task.executor.lastName}` : '—'}</span>
          </div>

          <div className="d-flex flex-wrap mb-3">
            <span className="text-muted me-2">{t('views.tasks.view.date')}:</span>
            <span>{formatDate(task.createdAt)}</span>
          </div>

          <div className="d-flex flex-wrap">
            <Link 
              to={`/editTask/${task.id}`} 
              className="btn btn-primary me-1"
            >
              {t('views.tasks.view.edit')}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}