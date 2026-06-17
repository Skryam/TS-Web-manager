import { useQuery, useMutation } from "@apollo/client/react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form"
import { GET_STATUS_BY_ID, UPDATE_STATUS } from "../graphql/queries";
import { Alert, Spinner } from "react-bootstrap";
import { updateStatusSchema, UpdateStatusInput } from "../zodSchemas/status";
import { zodResolver } from "@hookform/resolvers/zod";

interface GetStatusData {
  status: {
    id: string;
    name: string;
    createdAt: string;
  };
};

export default function EditStatus() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { error, data: statusData, loading } = useQuery<GetStatusData>(GET_STATUS_BY_ID, {
    variables: { id },
    skip: !id,
  });
  const [updateStatus] = useMutation(UPDATE_STATUS);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdateStatusInput>({
    resolver: zodResolver(updateStatusSchema),
    mode: 'onBlur',
    defaultValues: {
      name: statusData?.status.name || '',
    },
  });

  useEffect(() => {
    if (statusData?.status) {
      reset({
        name: statusData.status.name,
      });
    }
  }, [statusData, reset])

  const onSubmit = async (data: UpdateStatusInput) => {
    try {
      await updateStatus({ variables: {
        id: id,
        data: {
        name: data.name,
        },
      }
    });
    navigate('/statuses')
    } catch (err: any) {
      console.log(err)
    }
  };

  if (loading) return <Spinner animation="border" role="status" />;
  if (error) return <Alert variant="danger">Ошибка: {error.message}</Alert>;
  if (!statusData?.status) return <div>Статус не найден</div>;;

  return (
    <div className="container mt-5" style={{ maxWidth: '500px' }}>
      <h4 className="display-4 fw-bold mt-4">Редактирование статуса</h4>

      <form onSubmit={handleSubmit(onSubmit)}>

        <div className="mb-3">
          <label htmlFor="name" className="form-label">Название</label>
          <input
            id="name"
            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
            {...register('name')}
          />
          {errors.name && (
            <div className="invalid-feedback">{errors.name.message}</div>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
          >
            {isSubmitting ? 'Загрузка' : 'Подтвердить'}
          </button>
    </form>
  </div>
  );
};