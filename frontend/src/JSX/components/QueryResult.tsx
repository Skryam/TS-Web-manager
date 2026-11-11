import { ErrorLike } from "@apollo/client";
import { Alert, Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useFlash } from "./FlashProvider";

interface QueryResultProps {
  loading: boolean;
  error: ErrorLike | undefined;
  data: object | undefined;
  redirectPath?: string;
  children: React.ReactNode;
}
  
export const QueryResult = ({ loading, error, data, redirectPath, children }: QueryResultProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const flash = useFlash();

  if (loading) {
    return <Spinner animation="border" role="status" />;
  }
  if (error) {
    return <Alert variant="danger">{t('components.queryResult.error')}: {error.message}</Alert>;
  }
  if (!data) {
    flash(t('flash.queryResult.error'), 'danger');
    navigate(redirectPath ?? '/');
  }

  return <>{children}</>;
}