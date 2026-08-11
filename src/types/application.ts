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
  createdAt: string;
}

export interface CreateApplicationDTO {
  candidateId: string;
  jobId: string;
  curriculumUrl?: string;
}
