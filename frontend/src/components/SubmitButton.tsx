import { useFormContext } from "react-hook-form";
import { Button } from "react-bootstrap";

export const SubmitButton = () => {
  const {
    formState: { isSubmitting },
  } = useFormContext();

  return <Button
    type="submit"
    className="btn btn-primary"
    disabled={isSubmitting}
    >
      {isSubmitting ? 'Загрузка' : 'Подтвердить'}
  </Button>
}