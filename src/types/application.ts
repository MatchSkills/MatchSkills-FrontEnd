export type ApplicationStatus = 'pending' | 'evaluating' | 'completed';

export interface Application {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  curriculumUrl: string;
  status: ApplicationStatus;
  telegramLink?: string;
  softSkillScore?: number;
  hardSkillScore?: number;
  averageScore?: number;
  hardskills?: string[];
  softskills?: Record<string, number>;
  createdAt: string;
  createAt?: string;
}

/**
 * Payload dos dados da candidatura enviado na parte 'data' do multipart/form-data
 * conforme jobapplication (1).MD
 */
export interface JobApplicationDataPayload {
  jobpostingId: number | string;
  candidateId: number | string;
  candidateName: string;
  hardskills: string[];
}

/**
 * Payload esperado por POST /job-application/create conforme jobapplication (1).MD
 * Content-Type: multipart/form-data
 */
export interface CreateJobApplicationDTO {
  curriculum: File | Blob;
  data: JobApplicationDataPayload;
  candidateEmail?: string;
  jobTitle?: string;
  companyName?: string;
}

/**
 * Payload esperado por PUT /job-application/edit-softskills conforme jobapplication (1).MD
 */
export interface EditSoftSkillsDTO {
  id: number | string;
  softskills: Record<string, number>;
}

/**
 * Resposta esperada de POST /job-application/create e PUT /job-application/edit-softskills
 */
export interface JobApplicationResponse {
  id: number | string;
  jobpostingId: number | string;
  candidateId: number | string;
  candidateName: string;
  hardskills: string[];
  softskills?: Record<string, number>;
  createAt: string;
}

/**
 * Objeto de resposta para GET /job-application/jobposting/{id} (Visualização da empresa)
 */
export interface JobPostingApplicantMatch {
  candidateId?: number | string;
  applicationId?: number | string;
  candidateName: string;
  matchSoftSkillsPercent: number;
  matchHardSkillsPercent: number;
  curriculumUrl?: string;
}

export interface CreateApplicationDTO {
  candidateId: string;
  jobId: string;
  curriculumUrl?: string;
}
