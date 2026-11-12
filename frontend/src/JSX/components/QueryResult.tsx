import { ErrorLike } from "@apollo/client";
import { Alert, Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useFlash } from "./FlashProvider";
import { useIdParams } from "../../hooks/useIdParams";
import { useEffect, useRef } from "react";

interface QueryResultProps {
  loading: boolean;
  error: ErrorLike | undefined;
  data: object | undefined;
  redirectPath?: string;
  children: React.ReactNode;
}
  
export const QueryResult = ({ loading, error, data, redirectPath, children }: QueryResultProps) => {
  const id = useIdParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const flash = useFlash();
  
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (id === null) {
      flash(t('flash.queryResult.invalidId'), 'danger');
      navigate(redirectPath ?? '/', { replace: true });
      return
    }

    if (!loading && !error && !data && !hasRedirected.current) {
      hasRedirected.current = true;
      flash(t('flash.queryResult.error'), 'danger');
      navigate(redirectPath ?? '/', { replace: true });
    }
  }, [id, loading, error, data, redirectPath, flash, t, navigate]);

  if (id === null) {
    return null;
  }

  if (loading) {
    return <Spinner animation="border" role="status" />;
  }
  if (error) {
    return <Alert variant="danger">{t('components.queryResult.error')}: {error.message}</Alert>;
  }
  if (!data) {
    return null
  }

  return <>{children}</>;
}