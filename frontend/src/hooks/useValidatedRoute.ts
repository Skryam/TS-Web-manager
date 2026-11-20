import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';

import { useFlash } from '../app/components/FlashProvider';

import { useIdParams } from './useIdParams';

interface UseValidatedRouteOptions {
  redirectPath?: string;
}

export const useValidatedRoute = ({ redirectPath = '/'}: UseValidatedRouteOptions = {}) => {
  const id = useIdParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const flash = useFlash();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (id === null && !hasRedirected.current) {
      hasRedirected.current = true;
      flash(t('flash.queryResult.invalidId'), 'danger');
      navigate(redirectPath ?? '/', { replace: true });
    }
  }, [ id, redirectPath, flash, t, navigate]);

  return { id, isValid: id !== null };
};