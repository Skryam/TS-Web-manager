import {
  createContext,
  memo,
  useMemo,
  ReactNode,
  useContext,
  useState,
  useCallback,
} from 'react';

interface PageErrorContextData {
  setError: (error: string) => void;
  getError: () => string;
}

const PageErrorContext = createContext<PageErrorContextData>(
  {} as PageErrorContextData,
);

interface PageErrorProviderProps {
  children: ReactNode | ReactNode[];
}

export const PageErrorProvider = memo((props: PageErrorProviderProps) => {
  const [submitErrors, setSubmitErrors] = useState<string>('');

  const getError = useCallback(() => submitErrors, [submitErrors]);

  const setError = useCallback((error: string) => setSubmitErrors(error), []);

  const context = useMemo<PageErrorContextData>(() => ({setError, getError}), [setError, getError]);

  return <PageErrorContext.Provider {...props} value={context} />;
});

export const usePageErrorContext = (): PageErrorContextData =>
  useContext(PageErrorContext);

export default PageErrorContext;