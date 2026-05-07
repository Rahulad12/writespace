import { useState, useCallback } from 'react';
import { message } from 'antd';

interface UseAuthFormState {
  loading: boolean;
  error: string | null;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  handleError: (error: unknown, fallbackMessage: string) => void;
}

export const useAuthForm = (): UseAuthFormState => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleError = useCallback((err: unknown, fallbackMessage: string): void => {
    const axiosError = err as { response?: { data?: { message?: string } } };
    const apiMessage = axiosError.response?.data?.message;
    const displayMessage = apiMessage ?? fallbackMessage;
    message.error(displayMessage);
    setError(displayMessage);
  }, []);

  return { loading, error, setLoading, setError, handleError };
};
