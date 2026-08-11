import { apiClient } from '@/lib/axios';
import { Application } from '@/types/application';

export interface ApplyJobData {
  jobId: string;
  candidateId: string;
  candidateName?: string;
  candidateEmail?: string;
  jobTitle?: string;
  companyName?: string;
  curriculumFile?: File;
}

export const applicationsService = {
  async applyToJob(data: ApplyJobData): Promise<Application> {
    // Send request to Next.js mock API endpoint
    const response = await apiClient.post<Application>('/api/mock/applications', {
      jobId: data.jobId,
      candidateId: data.candidateId,
      candidateName: data.candidateName,
      candidateEmail: data.candidateEmail,
      jobTitle: data.jobTitle,
      companyName: data.companyName,
      curriculumUrl: data.curriculumFile ? data.curriculumFile.name : 'curriculo.pdf',
    });
    return response.data;
  },

  async getMyApplications(candidateId: string): Promise<Application[]> {
    const response = await apiClient.get<Application[]>(
      `/api/mock/applications?candidateId=${candidateId}`
    );
    return response.data;
  },

  async getApplicationById(id: string): Promise<Application> {
    const response = await apiClient.get<Application>(
      `/api/mock/applications?applicationId=${id}`
    );
    return response.data;
  },

  async triggerBotEndConversation(applicationId: string): Promise<{
    applicationId: string;
    status: string;
    softSkillScore: number;
    hardSkillScore: number;
    averageScore: number;
  }> {
    const response = await apiClient.post('/api/mock/telegram/end-conversation', {
      applicationId,
    });
    return response.data;
  },
};
