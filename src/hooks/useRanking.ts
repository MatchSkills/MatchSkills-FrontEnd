import { useCallback, useEffect, useState } from 'react';
import { rankingService } from '@/services/ranking.service';
import { RankingApplicant, RankingFilters } from '@/types/ranking';
import { toast } from 'sonner';

export const useRanking = (initialJobId?: string) => {
  const [jobId, setJobId] = useState<string>(initialJobId || 'job_1');
  const [jobTitle, setJobTitle] = useState<string>('');
  const [applicants, setApplicants] = useState<RankingApplicant[]>([]);
  const [filters, setFilters] = useState<RankingFilters>({ minScore: 0 });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchRanking = useCallback(async () => {
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
    } catch {
      toast.error('Erro ao carregar ranking da vaga.');
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
