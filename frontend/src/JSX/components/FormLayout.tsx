import React, { useEffect } from 'react';
import { Alert } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { usePageErrorContext } from '../context/PageErrorContext';

interface FormLayoutProps {
  title: string;
  children: React.ReactNode;
}

const PRISMA_ERROR_CODES_TRANSLATION: Record<string, string> = {
  ALREADY_EXISTS: 'alreadyExists',
}

export const FormLayout = ({ title, children }: FormLayoutProps) => {
  const { getError, clearError } = usePageErrorContext();
  const { t } = useTranslation();
  const error = getError();
  const parsedError = error?.message ?? error.error

  useEffect(() => {
    clearError();
  }, [location.pathname, clearError]);

  return (
    <div className="container mt-5" style={{ maxWidth: '500px' }}>
      <h3 className="display-4 fw-bold mt-4">{title}</h3>

      {error && (
        <Alert variant="danger" className="mb-3">
          {t('components.formLayout.errors.' + (PRISMA_ERROR_CODES_TRANSLATION[error?.message] ?? 'unknown'))}
        </Alert>
      )}

      {children}
    </div>
  );
};
