export interface SoftSkillRequirement {
  name: string;
  targetLevel: number; // 1 to 5
}

export interface Job {
  id: string;
  companyId: string;
  companyName: string;
  title: string;
  description: string;
  location: string;
  hardSkills: string[];
  softSkills: Record<string, number>; // e.g. { "Comunicação": 4, "Liderança": 3 }
  status?: 'active' | 'closed' | 'draft';
  salaryRange?: string;
  experienceLevel?: string;
  createdAt: string;

  // Aliases para compatibilidade direta com jobPosting.MD (Backend Java/Spring)
  local?: string;
  createAt?: string;
  targetHardskills?: string[];
  targetSoftskills?: Record<string, number>;
}

export interface CreateJobDTO {
  title: string;
  description: string;
  location?: string;
  hardSkills?: string[];
  softSkills?: Record<string, number>;
  companyId?: string;
  companyName?: string;
  status?: 'active' | 'closed' | 'draft';
  salaryRange?: string;
  experienceLevel?: string;

  // Campos esperados pelo backend em jobPosting.MD
  local?: string;
  targetHardskills?: string[];
  targetSoftskills?: Record<string, number>;
}

export type UpdateJobDTO = Partial<CreateJobDTO>;

export interface PaginatedJobs {
  content: Job[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}
