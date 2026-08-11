import { apiClient } from '@/lib/axios';
import { RankingResponse } from '@/types/ranking';

export const rankingService = {
  async getRankingByJob(
    jobId: string,
    minScore = 0,
    softSkill?: string,
    hardSkill?: string
  ): Promise<RankingResponse> {
    const params = new URLSearchParams();
    params.set('jobId', jobId);
    if (minScore > 0) params.set('minScore', String(minScore));
    if (softSkill) params.set('softSkill', softSkill);
    if (hardSkill) params.set('hardSkill', hardSkill);

    const response = await apiClient.get<RankingResponse>(`/api/mock/ranking?${params.toString()}`);
    return response.data;
  },
};
