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
  createdAt: string;
}

export interface CreateJobDTO {
  title: string;
  description: string;
  location: string;
  hardSkills: string[];
  softSkills: Record<string, number>;
}

export type UpdateJobDTO = Partial<CreateJobDTO>;

export interface PaginatedJobs {
  content: Job[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}
