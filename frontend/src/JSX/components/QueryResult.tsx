import { ErrorLike } from "@apollo/client";
import { Alert, Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";

interface QueryResultProps {
  loading: boolean;
  error: ErrorLike | undefined;
  data: object | undefined;
  children: React.ReactNode;
}
  
export const QueryResult = ({ loading, error, data, children }: QueryResultProps) => {
  const { t } = useTranslation();
  if (loading) {
    return <Spinner animation="border" role="status" />;
  }
  if (error) {
    return <Alert variant="danger">{t('components.queryResult.error')}: {error.message}</Alert>;
  }
  if (!data) {
    return null;
  }

  return <>{children}</>;
}