import { Form } from "react-bootstrap";
import { useFormContext, FieldError } from "react-hook-form";

interface TextInputProps {
  fieldName: string;
  label: string;
}

export const TextInput = (props: TextInputProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const fieldErrors = errors[props.fieldName] as FieldError;

  return <div className="mb-3">
    <Form.Label htmlFor={props.fieldName} className="form-label">{props.label}</Form.Label>
    <Form.Control
      id={props.fieldName}
      className={`form-control ${fieldErrors ? 'is-invalid' : ''}`}
      {...register(props.fieldName)}
    />
    {fieldErrors && (
      <div className="invalid-feedback">{fieldErrors.message}</div>
    )}
  </div>
}