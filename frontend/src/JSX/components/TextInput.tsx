import { Form } from "react-bootstrap";
import { useFormContext, FieldError } from "react-hook-form";

interface TextInputProps {
  fieldName: string;
  label: string;
  as?: 'input' | 'textarea';
  rows?: number;
}

export const TextInput = ({
  fieldName,
  label,
  as = 'input',
  rows = 3
}: TextInputProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const fieldErrors = errors[fieldName] as FieldError;

  return (
  <div className="mb-3">
    <Form.Label htmlFor={fieldName} className="form-label">{label}</Form.Label>
    {as === 'textarea' ? (
      <Form.Control
        as="textarea"
        rows={rows}
        id={fieldName}
        className={`form-control ${fieldErrors ? 'is-invalid' : ''}`}
        {...register(fieldName)}
      />
    ) : (
      <Form.Control
        as="input"
        id={fieldName}
        className={`form-control ${fieldErrors ? 'is-invalid' : ''}`}
        {...register(fieldName)}
      />
    )}
    {fieldErrors && (
      <div className="invalid-feedback">{fieldErrors.message}</div>
    )}
  </div>
  )
}