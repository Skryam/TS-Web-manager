import { Form } from "react-bootstrap";
import { useFormState, FieldError, useFormContext } from "react-hook-form";

interface SelectOption {
  id: string | number;
  label: string;
}

interface SelectInputProps {
  fieldName: string;
  label: string;
  options: SelectOption[];
  placeholder?: string;
}

export const SelectInput = ({
  fieldName,
  label,
  options,
  placeholder = "Выберите значение..."
}: SelectInputProps) => {
  const { register, formState: { errors }, setValue } = useFormContext();

  const { onChange: rhOnChange, ...rhfRest } = register(fieldName)

  const fieldErrors = errors[fieldName] as FieldError;

  return (
    <div className="mb-3">
      <Form.Label htmlFor={fieldName} className="form-label">{label}</Form.Label>
      <Form.Select
        id={fieldName}
        className={`form-select ${fieldErrors ? 'is-invalid' : ''}`}
        onChange={(e) => {
          const val = e.target.value;
          setValue(fieldName, val === '' ? undefined : val, { shouldValidate: true });
          rhOnChange(e);
        }}
        >
          <option id=''>{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.id} id={String(opt.id)}>
              {opt.label}
            </option>
          ))}
        </Form.Select>
        {fieldErrors && (
          <div className="invalid-feedback">{fieldErrors.message}</div>
        )}
    </div>
  )
}