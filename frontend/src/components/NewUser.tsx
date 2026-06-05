import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form"
import { api } from "../api/client";
import { createUserSchema, CreateUserInput } from '../zodSchemas/user';
import { zodResolver } from "@hookform/resolvers/zod";

//type CreatePostResponse = { id: number, email: string };

export default function NewUser() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: CreateUserInput) => {
    try {
      await api.post('/auth/signup', data);
      navigate("/");
    } catch (err: any) {
      
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2 className="display-4 fw-bold mt-4">Регистрация</h2>

      <div className="mb-3">
        <input
          className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
          placeholder="Имя"
          {...register('firstName')}
        />
        {errors.firstName && (
          <div className="invalid-feedback">{errors.firstName.message}</div>
        )}
      </div>

      <div className="mb-3">
        <input
          className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
          placeholder="Фамилия"
          {...register('lastName')}
        />
        {errors.lastName && (
          <div className="invalid-feedback">{errors.lastName.message}</div>
        )}
      </div>

      <div className="mb-3">
        <input
          className={`form-control ${errors.email ? 'is-invalid' : ''}`}
          placeholder="email"
          {...register('email')}
        />
        {errors.email && (
          <div className="invalid-feedback">{errors.email.message}</div>
        )}
      </div>

      <div className="mb-3">
        <input
          className={`form-control ${errors.password ? 'is-invalid' : ''}`}
          placeholder="Пароль"
          {...register('password')}
        />
        {errors.password && (
          <div className="invalid-feedback">{errors.password.message}</div>
        )}
      </div>

      <button
        type="submit"
        className="btn btn-primary"
        disabled={isSubmitting}
        >
          {isSubmitting ? 'Загрузка' : 'Зарегистрироваться'}
        </button>
    </form>
  );
};