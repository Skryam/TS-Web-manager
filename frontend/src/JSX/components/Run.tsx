import { ApolloClient } from "@apollo/client";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useFlash } from "./FlashProvider";

interface Options {
  sucessKey: string,
  errorKey: string,
  navigateTo: string,
  setError: (error: any) => void
}

export const run = async (
  mutation: () => Promise<ApolloClient.MutateResult>,
  { sucessKey, errorKey, navigateTo, setError }: Options,
) => {
  const flash = useFlash();
  const { t } = useTranslation();
  const navigate = useNavigate();

  try {
    const result = await mutation();
    flash(t(sucessKey))
    navigate(navigateTo)
    return result;
  } catch (err) {
    flash(t(errorKey), 'danger')
    setError(err)
  }
}