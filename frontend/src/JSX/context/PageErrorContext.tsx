import { GraphQLError } from 'graphql';
import {
  createContext,
  memo,
  useMemo,
  ReactNode,
  useContext,
  useState,
  useCallback,
} from 'react';
import { AxiosError } from 'axios';

interface PageErrorContextData {
  setError: (error) => void;
  getError: () => any;
  clearError: () => void;
}

const PageErrorContext = createContext<PageErrorContextData>(
  {} as PageErrorContextData,
);

interface PageErrorProviderProps {
  children: ReactNode | ReactNode[];
}

export const PageErrorProvider = memo(function PageErrorProvider(props: PageErrorProviderProps) {
  const [submitErrors, setSubmitErrors] = useState();

  const getError = useCallback(() => submitErrors, [submitErrors]);
  const setError = useCallback((error) => setSubmitErrors(error), []);
  const clearError = useCallback(() => setSubmitErrors(undefined), [])

  const context = useMemo<PageErrorContextData>(() => ({setError, getError, clearError}), [setError, getError]);

  return <PageErrorContext.Provider {...props} value={context} />;
});

export const usePageErrorContext = (): PageErrorContextData =>
  useContext(PageErrorContext);

export default PageErrorContext;