import { useEffect } from "react";
import { useForm, UseFormProps, UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";


export function useLocalizedForm<T extends object>(
  props: UseFormProps<T>
): UseFormReturn<T> {
  const { i18n } = useTranslation();
  const methods = useForm<T>(props);

  useEffect(() => {
    const handleLanguageChange = () => {
      methods.trigger();
    };

    i18n.on('languageChanged', handleLanguageChange);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n, methods]);

  return methods;
}