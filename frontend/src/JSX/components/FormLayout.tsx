import React, { useEffect } from 'react';
import { Alert, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { usePageErrorContext } from '../context/PageErrorContext';
import { getErrorCode } from '../../utils/GetErrorCode';
import { FormProvider, UseFormReturn } from 'react-hook-form';
import { ApolloClient } from '@apollo/client';

interface FormLayoutProps {
  title: string;
  providerMethods: UseFormReturn<any>;
  onSubmit: (data: any) => Promise<ApolloClient.MutateResult | undefined>;
  children: React.ReactNode;
}

const ERROR_CODES_TRANSLATION: Record<string, string> = {
  ALREADY_EXISTS: 'alreadyExists',
  USER_NOT_FOUND: 'userNotFound',
  INVALID_CURRENT_PASSWORD: 'invalidCurrentPassword',
  VALIDATION_ERROR: 'validationError',
  INTERNAL_ERROR: 'internalError'
}

export const FormLayout = ({
  title,
  providerMethods,
  onSubmit,
  children
 }: FormLayoutProps) => {
  const { getError, clearError } = usePageErrorContext();
  const { t } = useTranslation();
  const error = getErrorCode(getError());

  useEffect(() => {
    clearError();
  }, [location.pathname, clearError]);

  return (
    <div className="container mt-5" style={{ maxWidth: '500px' }}>
      <h3 className="display-4 fw-bold mt-4">{title}</h3>

      {error && (
        <Alert variant="danger" className="mb-3">
          {t('components.formLayout.errors.' + (ERROR_CODES_TRANSLATION[error] ?? 'unknown'))}
        </Alert>
      )}

      <FormProvider {...providerMethods}>
        <Form onSubmit={providerMethods.handleSubmit(onSubmit)}>
          {children}
        </Form>
      </FormProvider>
    </div>
  );
};