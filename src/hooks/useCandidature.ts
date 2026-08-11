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
    } catch (err) {
      toast.error('Erro ao enviar candidatura. Tente novamente.');
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
