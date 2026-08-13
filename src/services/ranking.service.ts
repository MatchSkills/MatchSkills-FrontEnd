import { mockApiClient } from '@/lib/axios';
import { RankingResponse } from '@/types/ranking';

const defaultMockRanking: RankingResponse = {
  jobId: 'job_1',
  jobTitle: 'Desenvolvedor Frontend Senior (Next.js)',
  totalElements: 3,
  totalPages: 1,
  applicants: [
    {
      candidateId: 'cand_1',
      applicationId: 'app_1',
      name: 'Lucas Silva',
      email: 'lucas.silva@example.com',
      status: 'completed',
      softSkillScore: 92,
      hardSkillScore: 88,
      averageScore: 90,
      evaluatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      candidateId: 'cand_2',
      applicationId: 'app_2',
      name: 'Mariana Costa',
      email: 'mariana.costa@example.com',
      status: 'completed',
      softSkillScore: 78,
      hardSkillScore: 95,
      averageScore: 86.5,
      evaluatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    },
    {
      candidateId: 'cand_3',
      applicationId: 'app_3',
      name: 'Carlos Eduardo',
      email: 'carlos.edu@example.com',
      status: 'evaluating',
      softSkillScore: 65,
      hardSkillScore: 58,
      averageScore: 61.5,
      evaluatedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    },
  ],
};

export const rankingService = {
  async getRankingByJob(
    jobId: string,
    minScore = 0,
    softSkill?: string,
    hardSkill?: string
  ): Promise<RankingResponse> {
    try {
      const params = new URLSearchParams();
      params.set('jobId', jobId);
      if (minScore > 0) params.set('minScore', String(minScore));
      if (softSkill) params.set('softSkill', softSkill);
      if (hardSkill) params.set('hardSkill', hardSkill);

      const response = await mockApiClient.get<RankingResponse>(`/api/mock/ranking?${params.toString()}`);
      return response.data;
    } catch {
      return {
        ...defaultMockRanking,
        jobId,
      };
    }
  },
};
