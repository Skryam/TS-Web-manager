import { ErrorLike } from '@apollo/client';
import { Alert, Spinner } from 'react-bootstrap';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useFlash } from './FlashProvider';

interface QueryResultProps {
  loading: boolean;
  error: ErrorLike | undefined;
  data: object | undefined;
  redirectPath?: string;
  children: React.ReactNode;
}
  
export const QueryResult = ({ loading, error, data, redirectPath, children }: QueryResultProps) => {
  const hasRedirected = useRef(false);
  const flash = useFlash();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    if (!loading && !error && !data && !hasRedirected.current) {
      hasRedirected.current = true;
      flash(t('flash.queryResult.error'), 'danger');
      navigate(redirectPath ?? '/', { replace: true });
    }
  }, [loading, error, data, redirectPath, flash, t, navigate]);

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
};