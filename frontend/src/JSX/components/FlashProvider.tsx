import { createContext, useCallback, useContext, useState } from 'react';
import { Toast } from 'react-bootstrap';

type FlashVariant = 'success' | 'danger' | 'warning' | 'info';

interface FlashMessage {
  id: number;
  text: string;
  variant: FlashVariant;
}

type ShowFlash = (text: string, variant?: FlashVariant) => void;

const FlashContext = createContext<ShowFlash>(() => {});

export const useFlash = () => useContext(FlashContext);

let nextId = 0;

export default function FlashProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<FlashMessage[]>([]);

  const remove = useCallback((id: number) => {
    setMessages(prev => prev.filter(m => m.id !== id));
  }, []);

  const showFlash = useCallback<ShowFlash>((text, variant = 'success') => {
    const id = ++nextId;
    setMessages(prev => [...prev, { id, text, variant }]);
    setTimeout(() => remove(id), 5000); // автоскрытие через 5 сек
  }, [remove]);

  return (
    <FlashContext.Provider value={showFlash}>
      {children}

      {/* Контейнер тостов в правом верхнем углу */}
      <div className="toast-container position-fixed top-0 end-0 p-3" style={{ zIndex: 1080 }}>
        {messages.map(m => (
          <Toast key={m.id} bg={m.variant} onClose={() => remove(m.id)}>
            <Toast.Body className={`fw-semibold ${m.variant !== 'warning' ? 'text-white' : ''}`}>
              {m.text}
            </Toast.Body>
          </Toast>
        ))}
      </div>
    </FlashContext.Provider>
  );
}