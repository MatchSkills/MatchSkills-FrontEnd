import axios from 'axios';
import { useState } from 'react';
import { applicationsService, ApplyJobData } from '@/services/applications.service';
import { Application } from '@/types/application';
import { toast } from 'sonner';

export const useCandidature = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [currentApplication, setCurrentApplication] = useState<Application | null>(null);

  const apply = async (data: ApplyJobData): Promise<Application | null> => {
    setIsSubmitting(true);
    try {
      const result = await applicationsService.applyToJob(data);
      setCurrentApplication(result);
      toast.success('Candidatura enviada com sucesso!');
      return result;
    } catch (err: unknown) {
      let errorMsg = 'Erro ao enviar candidatura. Tente novamente.';
      if (axios.isAxiosError(err)) {
        const serverMessage = err.response?.data?.message || err.response?.data?.error;
        const status = err.response?.status;
        if (serverMessage) {
          errorMsg = serverMessage;
        } else if (status === 409) {
          errorMsg = 'Você já se candidatou a esta vaga anteriormente.';
        } else if (status === 401 || status === 403) {
          errorMsg = 'Apenas candidatos autenticados podem se candidatar a vagas.';
        } else if (status === 400) {
          errorMsg = 'Parâmetros inválidos ao enviar candidatura.';
        }
      }
      toast.error(errorMsg);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    apply,
    isSubmitting,
    currentApplication,
    setCurrentApplication,
  };
};
