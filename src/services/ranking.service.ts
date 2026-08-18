import { jobApplicationApiClient } from '@/lib/axios';
import { JobPostingApplicantMatch } from '@/types/application';
import { RankingApplicant, RankingResponse } from '@/types/ranking';

export const rankingService = {
  /**
   * Obtém o ranking real de candidatos para uma vaga da empresa
   * Endpoint: GET /job-application/jobposting/{jobId}
   * Conforme jobapplication (1).MD
   */
  async getRankingByJob(
    jobId: string | number,
    minScore = 0,
    softSkill?: string,
    hardSkill?: string
  ): Promise<RankingResponse> {
    if (!jobId) {
      return {
        jobId: '',
        jobTitle: '',
        applicants: [],
        totalElements: 0,
        totalPages: 0,
      };
    }

    const response = await jobApplicationApiClient.get<JobPostingApplicantMatch[]>(
      `/job-application/jobposting/${jobId}`
    );

    const matches = Array.isArray(response.data) ? response.data : [];

    const applicants: RankingApplicant[] = matches.map((item, index) => {
      const softSkillScore = Number(item.matchSoftSkillsPercent) || 0;
      const hardSkillScore = Number(item.matchHardSkillsPercent) || 0;
      const averageScore = Math.round((softSkillScore + hardSkillScore) / 2);

      return {
        candidateId: item.candidateId ? String(item.candidateId) : `cand_${index + 1}`,
        applicationId: item.applicationId ? String(item.applicationId) : '',
        name: item.candidateName || 'Candidato',
        email: '',
        softSkillScore,
        hardSkillScore,
        averageScore,
        status: 'completed',
      };
    });

    const filteredApplicants =
      minScore > 0
        ? applicants.filter((a) => a.averageScore >= minScore)
        : applicants;

    return {
      jobId: String(jobId),
      jobTitle: '',
      applicants: filteredApplicants,
      totalElements: filteredApplicants.length,
      totalPages: 1,
    };
  },
};

