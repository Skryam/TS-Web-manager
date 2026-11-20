import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';
import { useEffect } from 'react';

import { useFlash } from './FlashProvider';
  
export const NotFoundRedirect = () => {
  const { t } = useTranslation();
  const flash = useFlash();

  useEffect(() => {
    flash(t('flash.errors.pageNotFound'), 'danger');
  }, [flash, t]);

  return <Navigate to='/' replace />;
};