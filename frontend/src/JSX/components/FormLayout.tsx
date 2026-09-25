import React from 'react';
import { Alert } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { usePageErrorContext } from '../context/PageErrorContext';

interface FormLayoutProps {
  title: string;
  children: React.ReactNode;
  error?: string | null;
}

export const FormLayout = ({ title, children, error }: FormLayoutProps) => {
  const { getError } = usePageErrorContext();
  const { t } = useTranslation();
  return (
    <div className="container mt-5" style={{ maxWidth: '500px' }}>
      <h3 className="display-4 fw-bold mt-4">{title}</h3>

      {error && (
        <Alert variant="danger" className="mb-3">
          {t(getError())}
        </Alert>
      )}

      {children}
    </div>
  );
};
