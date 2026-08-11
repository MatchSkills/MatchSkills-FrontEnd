import { ApplicationStatus } from './application';

export interface RankingApplicant {
  candidateId: string;
  applicationId: string;
  name: string;
  email?: string;
  softSkillScore: number; // 0 to 100
  hardSkillScore: number; // 0 to 100
  averageScore: number;   // 0 to 100
  status: ApplicationStatus;
  evaluatedAt?: string;
}

export interface RankingResponse {
  jobId: string;
  jobTitle: string;
  applicants: RankingApplicant[];
  totalElements: number;
  totalPages: number;
}

export interface RankingFilters {
  softSkill?: string;
  hardSkill?: string;
  minScore?: number;
}
