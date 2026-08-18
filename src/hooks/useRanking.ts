import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { rankingService } from '@/services/ranking.service';
import { RankingApplicant, RankingFilters } from '@/types/ranking';
import { toast } from 'sonner';

export const useRanking = (initialJobId?: string) => {
  const [jobId, setJobId] = useState<string>(initialJobId || '');
  const [jobTitle, setJobTitle] = useState<string>('');
  const [applicants, setApplicants] = useState<RankingApplicant[]>([]);
  const [filters, setFilters] = useState<RankingFilters>({ minScore: 0 });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchRanking = useCallback(async () => {
    if (!jobId) {
      setApplicants([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const data = await rankingService.getRankingByJob(
        jobId,
        filters.minScore,
        filters.softSkill,
        filters.hardSkill
      );
      setApplicants(data.applicants);
      setJobTitle(data.jobTitle);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 404) {
          setApplicants([]);
        } else if (err.response?.status === 403) {
          toast.error('Acesso não permitido para esta vaga.');
          setApplicants([]);
        } else if (err.response?.status === 401) {
          toast.error('Sessão expirada. Faça login novamente.');
          setApplicants([]);
        } else {
          toast.error('Erro ao carregar candidatos da vaga.');
          setApplicants([]);
        }
      } else {
        toast.error('Erro ao carregar ranking da vaga.');
        setApplicants([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, [jobId, filters]);

  useEffect(() => {
    fetchRanking();
  }, [fetchRanking]);

  return {
    jobId,
    setJobId,
    jobTitle,
    applicants,
    filters,
    setFilters,
    isLoading,
    refreshRanking: fetchRanking,
  };
};
