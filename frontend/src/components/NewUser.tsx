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
      console.log(err)
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '500px' }}>
      <h3 className="display-4 fw-bold mt-4">Регистрация</h3>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <label htmlFor="firstName" className="form-label">Имя</label>
          <input
            id="firstName"
            className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
            {...register('firstName')}
          />
          {errors.firstName && (
            <div className="invalid-feedback">{errors.firstName.message}</div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="lastName" className="form-label">Фамилия</label>
          <input
            id="lastName"
            className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
            {...register('lastName')}
          />
          {errors.lastName && (
            <div className="invalid-feedback">{errors.lastName.message}</div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">email</label>
          <input
            id="email"
            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
            {...register('email')}
          />
          {errors.email && (
            <div className="invalid-feedback">{errors.email.message}</div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">Пароль</label>
          <input
            id="password"
            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
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
  </div>
  );
};