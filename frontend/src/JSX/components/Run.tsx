import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useFlash } from "./FlashProvider";

interface RunOptions {
  sucessKey: string,
  errorKey: string,
  navigateTo: string,
  setError: (error: any) => void
}

export const useRun = () => {
  const flash = useFlash();
  const { t } = useTranslation();
  const navigate = useNavigate();

  return async <T = any>(
    fetch: () => Promise<T>,
    { sucessKey, errorKey, navigateTo, setError }: RunOptions,
  ) => {
    try {
      const result = await fetch();
    flash(t(sucessKey))
    navigate(navigateTo)
    return result;
  } catch (err) {
    flash(t(errorKey), 'danger')
    setError(err)
  }
  }
}