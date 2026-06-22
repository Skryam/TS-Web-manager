import { useQuery, useMutation } from "@apollo/client/react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form"
import { GET_USER_BY_ID, UPDATE_USER } from "../graphql/queries";
import { Alert, Spinner } from "react-bootstrap";
import { updateUserSchema, UpdateUserInput } from '../zodSchemas/user';
import { zodResolver } from "@hookform/resolvers/zod";

interface GetUserData {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
};

export default function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { error, data: userData, loading } = useQuery<GetUserData>(GET_USER_BY_ID, {
    variables: { id },
    skip: !id,
  });
  const [updateUser] = useMutation(UPDATE_USER);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdateUserInput>({
    resolver: zodResolver(updateUserSchema),
    mode: 'onBlur',
    defaultValues: {
      firstName: userData?.user.firstName || '',
      lastName: userData?.user.lastName || '',
      email: userData?.user.email || '',
      password: '',
    },
  });

  useEffect(() => {
    if (userData?.user) {
      reset({
        firstName: userData.user.firstName,
        lastName: userData.user.lastName,
        email: userData.user.email,
        password: '',
      });
    }
  }, [userData, reset])

  const onSubmit = async (data: UpdateUserInput) => {
    try {
      await updateUser({ variables: {
        id: id,
        data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password || undefined,
        },
      }
    });
    navigate('/users')
    } catch (err: any) {
      console.log(err)
    }
  };

  if (loading) {
    return <Spinner animation="border" role="status" />;
  }
  if (error) {
    return <Alert variant="danger">Ошибка: {error.message}</Alert>;
  }
  if (!userData?.user) {
    return <div>Пользователь не найден</div>;
  }

  return (
    <div className="container mt-5" style={{ maxWidth: '500px' }}>
      <h4 className="display-4 fw-bold mt-4">Редактирование пользователя</h4>

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
            {isSubmitting ? 'Загрузка' : 'Подтвердить'}
          </button>
    </form>
  </div>
  );
};