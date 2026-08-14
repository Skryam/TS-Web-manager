import { Form } from "react-bootstrap";
import { FieldError, useFormContext } from "react-hook-form";

interface SelectOption {
  id: string | number;
  label: string;
}

interface SelectInputProps {
  fieldName: string;
  label: string;
  options: SelectOption[];
  placeholder?: string;
  multiple?: boolean;
}

export const SelectInput = ({
  fieldName,
  label,
  options,
  placeholder = "",
  multiple = false,
}: SelectInputProps) => {
  const { register, formState: { errors }, setValue, watch } = useFormContext();
  const { onChange: rhOnChange, ...rhfRest } = register(fieldName);
  
  const fieldErrors = errors[fieldName] as FieldError;
  const currentValue = watch(fieldName);

  const normalizeArray = (val: any) => {
    if (!Array.isArray(val)) return [];
    return val.map(item => {
      return typeof item === 'object' && item !== null ? String(item.id) : String(item);
    });
  };

  const normalizedValue = multiple
    ? normalizeArray(currentValue)
    : String(currentValue ?? "");

  return (
    <div className="mb-3">
      <Form.Label htmlFor={fieldName} className="form-label">{label}</Form.Label>
      
      <Form.Select
        key={JSON.stringify(normalizedValue)} 
        id={fieldName}
        multiple={multiple}
        value={normalizedValue}
        {...(multiple ? { rows: 5 } : {})}
        className={`form-select ${fieldErrors ? 'is-invalid' : ''}`}
        onChange={(e) => {
          if (multiple) {
            const selected = Array.from(e.target.selectedOptions, opt => opt.value);
            setValue(fieldName, selected.length > 0 ? selected : [], { shouldValidate: true });
          } else {
            const val = e.target.value;
            setValue(fieldName, val === '' ? undefined : val, { shouldValidate: true });
          }
          rhOnChange(e);
        }}
        {...rhfRest}
        >
          {!multiple && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.id} value={String(opt.id)}>
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