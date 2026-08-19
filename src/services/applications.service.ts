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
   * Conforme jobapplication (1).MD:
   * POST /job-application/create (Candidate Role)
   * Content-Type: multipart/form-data
   * Parts:
   * - curriculum: File | Blob
   * - data: { jobpostingId: Long, candidateId: Long, candidateName: String, hardskills: List<String> }
   */
  async createApplication(dto: CreateJobApplicationDTO): Promise<JobApplicationResponse> {
    const formData = new FormData();

    // Anexa o arquivo de currículo
    formData.append('curriculum', dto.curriculum);

    // Constrói o objeto data com IDs numéricos (Long)
    const dataObj = {
      jobpostingId: isNaN(Number(dto.data.jobpostingId))
        ? dto.data.jobpostingId
        : Number(dto.data.jobpostingId),
      candidateId: isNaN(Number(dto.data.candidateId))
        ? dto.data.candidateId
        : Number(dto.data.candidateId),
      candidateName: dto.data.candidateName,
      hardskills: Array.isArray(dto.data.hardskills) ? dto.data.hardskills : [],
    };

    // No padrão multipart para backend Spring/REST, o JSON pode ser enviado como Blob com type application/json
    const jsonBlob = new Blob([JSON.stringify(dataObj)], { type: 'application/json' });
    formData.append('data', jsonBlob);

    const response = await jobApplicationApiClient.post<JobApplicationResponse>(
      '/job-application/create',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  /**
   * Conforme jobapplication (1).MD:
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
   * Conforme jobapplication (1).MD:
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
   * Fluxo de candidatura do candidato no frontend:
   * Envia a candidatura de forma atômica via POST /job-application/create (multipart/form-data)
   * contendo o currículo (PDF) e os dados do candidato e da vaga.
   */
  async applyToJob(data: ApplyJobData): Promise<Application> {
    const curriculumFile =
      data.curriculumFile ||
      new Blob(['Curriculo em PDF'], { type: 'application/pdf' });

    const appCreated = await this.createApplication({
      curriculum: curriculumFile,
      data: {
        jobpostingId: data.jobId,
        candidateId: data.candidateId,
        candidateName: data.candidateName || 'Candidato',
        ...(data.hardskills ? { hardskills: data.hardskills } : {}),
      },
      candidateEmail: data.candidateEmail,
      jobTitle: data.jobTitle,
      companyName: data.companyName,
    });

    const applicationId = String(appCreated.id);
    const curriculumFileName =
      data.curriculumFile?.name || 'curriculo.pdf';

    const newApplication: Application = {
      id: applicationId,
      jobId: String(data.jobId),
      candidateId: String(data.candidateId),
      candidateName: data.candidateName || 'Candidato',
      candidateEmail: data.candidateEmail || 'candidato@example.com',
      jobTitle: data.jobTitle || 'Vaga em Tecnologia',
      companyName: data.companyName || 'Empresa Parceira',
      curriculumUrl: curriculumFileName,
      status: 'pending',
      telegramLink: `https://t.me/MatchSkillsBot?start=${applicationId}_${data.jobId}`,
      hardskills: data.hardskills || appCreated.hardskills || [],
      softskills: appCreated.softskills,
      createdAt: appCreated.createAt || new Date().toISOString(),
      createAt: appCreated.createAt || new Date().toISOString(),
    };

    return newApplication;
  },

  /**
   * Obtém as candidaturas de um candidato via endpoint real:
   * GET /job-application/candidate/{id}
   */
  async getApplicationsByCandidate(candidateId: string | number): Promise<Application[]> {
    const response = await jobApplicationApiClient.get<any[]>(
      `/job-application/candidate/${candidateId}`
    );
    const data = response.data;
    const list = Array.isArray(data)
      ? data
      : Array.isArray((data as any)?.content)
      ? (data as any).content
      : [];

    return list.map((raw: any) => {
      const id = String(raw.id || raw.applicationId || '');
      const jobId = String(raw.jobpostingId || raw.jobId || '');
      
      const rawSoftskills = raw.softskills ?? raw.softSkills ?? null;
      // Para saber se o status da conversa foi finalizado, basta verificar se a softskill do candidato naquela vaga não é null
      const hasSoftSkills =
        rawSoftskills !== null &&
        rawSoftskills !== undefined &&
        (typeof rawSoftskills === 'object'
          ? Object.keys(rawSoftskills).length > 0
          : Boolean(rawSoftskills));

      const status: Application['status'] = hasSoftSkills ? 'completed' : 'pending';

      const softSkillScore =
        raw.softSkillScore ?? raw.matchSoftSkillsPercent;
      const hardSkillScore =
        raw.hardSkillScore ?? raw.matchHardSkillsPercent;
      
      let averageScore = raw.averageScore;
      if (
        averageScore === undefined &&
        softSkillScore !== undefined &&
        hardSkillScore !== undefined
      ) {
        averageScore = Math.round((Number(softSkillScore) + Number(hardSkillScore)) / 2);
      }

      return {
        id,
        jobId,
        candidateId: String(raw.candidateId || candidateId),
        candidateName: raw.candidateName || 'Candidato',
        candidateEmail: raw.candidateEmail || '',
        jobTitle: raw.jobTitle || raw.job?.title || (jobId ? `Vaga #${jobId}` : `Candidatura #${id}`),
        companyName:
          raw.companyName || raw.company?.name || raw.job?.companyName || 'Empresa',
        curriculumUrl: raw.curriculumUrl || raw.curriculumFileName || '',
        status,
        telegramLink:
          raw.telegramLink || `https://t.me/MatchSkillsBot?start=${id}_${jobId}`,
        softSkillScore: softSkillScore !== undefined ? Number(softSkillScore) : undefined,
        hardSkillScore: hardSkillScore !== undefined ? Number(hardSkillScore) : undefined,
        averageScore: averageScore !== undefined ? Number(averageScore) : undefined,
        hardskills: Array.isArray(raw.hardskills) ? raw.hardskills : [],
        softskills: rawSoftskills,
        createdAt: raw.createAt || raw.createdAt || new Date().toISOString(),
        createAt: raw.createAt || raw.createdAt || new Date().toISOString(),
      };
    });
  },

  async getMyApplications(candidateId: string | number): Promise<Application[]> {
    return this.getApplicationsByCandidate(candidateId);
  },

  async getApplicationById(id: string): Promise<Application> {
    const response = await jobApplicationApiClient.get<any>(
      `/job-application/${id}`
    );
    const raw = response.data;
    const appId = String(raw.id || id);
    const jobId = String(raw.jobpostingId || raw.jobId || '');
    return {
      id: appId,
      jobId,
      candidateId: String(raw.candidateId || ''),
      candidateName: raw.candidateName || 'Candidato',
      candidateEmail: raw.candidateEmail || '',
      jobTitle: raw.jobTitle || `Vaga #${jobId}`,
      companyName: raw.companyName || 'Empresa',
      curriculumUrl: raw.curriculumUrl || '',
      status: raw.status || 'pending',
      telegramLink: raw.telegramLink || `https://t.me/MatchSkillsBot?start=${appId}_${jobId}`,
      softSkillScore: raw.softSkillScore ?? raw.matchSoftSkillsPercent,
      hardSkillScore: raw.hardSkillScore ?? raw.matchHardSkillsPercent,
      averageScore: raw.averageScore,
      hardskills: raw.hardskills || [],
      softskills: raw.softskills,
      createdAt: raw.createAt || raw.createdAt || new Date().toISOString(),
      createAt: raw.createAt || raw.createdAt || new Date().toISOString(),
    };
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
