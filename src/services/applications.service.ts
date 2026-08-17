import { jobApplicationApiClient, mockApiClient } from '@/lib/axios';
import {
  Application,
  CreateJobApplicationDTO,
  JobApplicationResponse,
  JobPostingApplicantMatch,
} from '@/types/application';

export interface ApplyJobData {
  jobId: string | number;
  candidateId: string | number;
  candidateName?: string;
  candidateEmail?: string;
  jobTitle?: string;
  companyName?: string;
  curriculumFile?: File;
  hardskills?: string[];
}

export const applicationsService = {
  /**
   * Conforme jobapplication.MD:
   * POST /job-application/create (Candidate Role)
   */
  async createApplication(data: CreateJobApplicationDTO): Promise<JobApplicationResponse> {
    const payload = {
      jobpostingId: isNaN(Number(data.jobpostingId)) ? data.jobpostingId : Number(data.jobpostingId),
      candidateId: isNaN(Number(data.candidateId)) ? data.candidateId : Number(data.candidateId),
      candidateName: data.candidateName,
      hardskills: Array.isArray(data.hardskills) ? data.hardskills : [],
    };
    const response = await jobApplicationApiClient.post<JobApplicationResponse>(
      '/job-application/create',
      payload
    );
    return response.data;
  },

  /**
   * Conforme jobapplication.MD:
   * GET /job-application/jobposting/{id} (Company Role)
   */
  async getApplicationsByJobPosting(
    jobpostingId: string | number
  ): Promise<JobPostingApplicantMatch[]> {
    const response = await jobApplicationApiClient.get<JobPostingApplicantMatch[]>(
      `/job-application/jobposting/${jobpostingId}`
    );
    return response.data;
  },

  /**
   * Conforme jobapplication.MD:
   * PUT /job-application/edit-softskills
   */
  async editSoftSkills(
    id: string | number,
    softskills: Record<string, number>
  ): Promise<JobApplicationResponse> {
    const response = await jobApplicationApiClient.put<JobApplicationResponse>(
      '/job-application/edit-softskills',
      {
        id: isNaN(Number(id)) ? id : Number(id),
        softskills,
      }
    );
    return response.data;
  },

  /**
   * Fluxo composto completo para o frontend:
   * 1. Cria candidatura via POST /job-application/create
   * 2. Envia PDF do currículo via POST /curriculum/job-application/{id}
   */
  async applyToJob(data: ApplyJobData): Promise<Application> {
    // 1. Criação no JobApplication Service real
    const appCreated = await this.createApplication({
      jobpostingId: data.jobId,
      candidateId: data.candidateId,
      candidateName: data.candidateName || 'Candidato',
      hardskills: data.hardskills || [],
      candidateEmail: data.candidateEmail,
      jobTitle: data.jobTitle,
      companyName: data.companyName,
    });

    const applicationId = String(appCreated.id);

    // 2. Upload do Currículo (se fornecido)
    let curriculumUrl = 'curriculo.pdf';
    if (data.curriculumFile) {
      try {
        const formData = new FormData();
        formData.append('file', data.curriculumFile);
        await mockApiClient.post(
          `/api/mock/curriculum/job-application/${applicationId}`,
          formData,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
          }
        );
        curriculumUrl = data.curriculumFile.name;
      } catch {
        curriculumUrl = data.curriculumFile.name;
      }
    }

    const newApplication: Application = {
      id: applicationId,
      jobId: String(data.jobId),
      candidateId: String(data.candidateId),
      candidateName: data.candidateName || 'Candidato',
      candidateEmail: data.candidateEmail || 'candidato@example.com',
      jobTitle: data.jobTitle || 'Vaga em Tecnologia',
      companyName: data.companyName || 'Empresa Parceira',
      curriculumUrl,
      status: 'pending',
      telegramLink: `https://t.me/MatchSkillsEvaluationBot?start=${applicationId}`,
      hardskills: data.hardskills || [],
      createdAt: appCreated.createAt || new Date().toISOString(),
      createAt: appCreated.createAt || new Date().toISOString(),
    };

    return newApplication;
  },

  async getMyApplications(candidateId: string): Promise<Application[]> {
    try {
      const response = await mockApiClient.get<Application[]>(
        `/api/mock/applications?candidateId=${candidateId}`
      );
      return response.data;
    } catch {
      return [];
    }
  },

  async getApplicationById(id: string): Promise<Application> {
    const response = await mockApiClient.get<Application>(
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
    const response = await mockApiClient.post('/api/mock/telegram/end-conversation', {
      applicationId,
    });
    return response.data;
  },
};
