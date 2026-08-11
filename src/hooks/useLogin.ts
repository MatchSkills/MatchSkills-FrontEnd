import { useState } from 'react';
import { useAuth } from './useAuth';
import { LoginCandidateCredentials, LoginCompanyCredentials } from '@/types/auth';

export const useLogin = () => {
  const { loginCandidate, loginCompany } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCandidateLogin = async (credentials: LoginCandidateCredentials) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await loginCandidate(credentials);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha no login');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompanyLogin = async (credentials: LoginCompanyCredentials) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await loginCompany(credentials);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha no login');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleCandidateLogin,
    handleCompanyLogin,
    isSubmitting,
    error,
  };
};
