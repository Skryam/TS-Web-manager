import { useTranslation } from "react-i18next";
import { Navigate } from "react-router-dom";
import { useFlash } from "./FlashProvider";
import { useEffect } from "react";
  
export const NotFoundRedirect = () => {
  const { t } = useTranslation();
  const flash = useFlash();

  useEffect(() => {
    flash(t('flash.errors.pageNotFound'), 'danger')
  }, [flash, t]);

  return <Navigate to='/' replace />
}