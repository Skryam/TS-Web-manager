import { useFormContext } from "react-hook-form";
import { Button } from "react-bootstrap";
import { useTranslation } from "react-i18next"

export const SubmitButton = () => {
  const { t } = useTranslation();
  const {
    formState: { isSubmitting },
  } = useFormContext();

  return <Button
    type="submit"
    className="btn btn-primary"
    disabled={isSubmitting}
    >
      {isSubmitting ? t('components.submitButton.download') : t('components.submitButton.submit')}
  </Button>
}