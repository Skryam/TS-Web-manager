import { Form } from "react-bootstrap";
import { useFormContext, FieldError } from "react-hook-form";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const fieldErrors = errors[fieldName] as FieldError;

  const rawErrorMessage = fieldErrors?.message || '';

  console.log(t(rawErrorMessage.replace('custom', '')))

  const message = rawErrorMessage.startsWith('custom:')
    ? t(rawErrorMessage.replace('custom', ''))
    : rawErrorMessage;

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
      <div className="invalid-feedback">{message}</div>
    )}
  </div>
  )
}