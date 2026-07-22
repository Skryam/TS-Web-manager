import { useQuery, useMutation } from "@apollo/client/react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form"
import { Alert, Spinner, Form } from "react-bootstrap";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider } from "react-hook-form";

import { GET_STATUS_BY_ID, UPDATE_STATUS } from "../../../graphql/queries";
import { updateStatusSchema, UpdateStatusInput } from "../../../zodSchemas/status";
import { TextInput } from "../../components/TextInput";
import { SubmitButton } from "../../components/SubmitButton";
import { FormLayout } from "../../components/FormLayout";

export default function ViewTask() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [submitErrors, setSubmitErrors] = useState<string | null>(null)

  const { error, data, loading } = useQuery(GET_STATUS_BY_ID, {
    variables: { id },
    skip: !id,
  });

  if (loading) {
    return <Spinner animation="border" role="status" />;
  }
  if (error) {
    return <Alert variant="danger">Ошибка: {error.message}</Alert>;
  }
  if (!data?.getStatus) {
    return <div>Задача не найдена</div>;
  }

  return (
  )
};