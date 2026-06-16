import client from "../apollo/client";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form"
import { api } from "../api/client";
import { createLoginSchema, CreateLoginInput } from "../zodSchemas/login";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert } from "react-bootstrap";

export default function Login() {
  const navigate = useNavigate();
  const [submitErrors, setErrors] = useState(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateLoginInput>({
    resolver: zodResolver(createLoginSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: CreateLoginInput) => {
    try {
      await api.post('/auth/login', data);
      await client.resetStore();
      navigate("/");
    } catch (err: any) {
      setErrors(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '500px' }}>
      <h3 className="display-4 fw-bold mt-4">Вход</h3>

      {submitErrors ? <Alert variant="danger">Неверный логин либо пароль</Alert> : null}

      <form onSubmit={handleSubmit(onSubmit)}>
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
            {isSubmitting ? 'Загрузка' : 'Вход'}
          </button>
    </form>
  </div>
  );
};