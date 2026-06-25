import { useMutation } from "@apollo/client/react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form"
import { CREATE_STATUS } from "../graphql/queries";
import { CreateStatusInput, createStatusSchema } from "../zodSchemas/status";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "react-bootstrap";

export default function NewStatus() {
  const navigate = useNavigate();
  const [CreateStatus] = useMutation(CREATE_STATUS);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateStatusInput>({
    resolver: zodResolver(createStatusSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: CreateStatusInput) => {
    console.log(data)
    try {
      await CreateStatus({ variables: {
        data: data
      }});
      navigate('/statuses');
    } catch (err: any) {
      console.log(err)
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '500px' }}>
      <h3 className="display-4 fw-bold mt-4">Добавление статуса</h3>

      <Form onSubmit={handleSubmit(onSubmit)}>
        
        <div className="mb-3">
          <Form.label htmlFor="name" className="form-label">Название</Form.label>
          <Form.Control
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
    </Form>
  </div>
  );
};