import { jobPostingApiClient } from '@/lib/axios';
import { CreateJobDTO, Job, PaginatedJobs, UpdateJobDTO } from '@/types/job';

interface RawJobBackend {
  id?: string | number;
  companyId?: string | number;
  companyName?: string;
  company?: { name?: string };
  title?: string;
  description?: string;
  local?: string;
  location?: string;
  targetHardskills?: string[];
  hardSkills?: string[];
  targetSoftskills?: Record<string, number>;
  softSkills?: Record<string, number>;
  status?: string;
  salaryRange?: string;
  experienceLevel?: string;
  createAt?: string;
  createdAt?: string;
}

interface RawPaginatedResponse {
  content?: RawJobBackend[];
  totalElements?: number;
  totalPages?: number;
  page?: number;
  number?: number;
  size?: number;
}

/**
 * Normaliza objetos de vaga do backend (jobPosting.MD) para o formato padrão do frontend.
 */
export const normalizeJob = (raw: RawJobBackend | null | undefined): Job => {
  if (!raw) {
    return {
      id: '',
      companyId: '',
      companyName: 'Empresa',
      title: '',
      description: '',
      location: '',
      hardSkills: [],
      softSkills: {},
      status: 'active',
      salaryRange: 'A combinar',
      experienceLevel: 'Pleno/Sênior',
      createdAt: new Date().toISOString(),
    };
  }
  return {
    id: String(raw.id || ''),
    companyId: String(raw.companyId || ''),
    companyName: raw.companyName || raw.company?.name || 'Empresa',
    title: raw.title || '',
    description: raw.description || '',
    location: raw.local || raw.location || '',
    hardSkills: raw.targetHardskills || raw.hardSkills || [],
    softSkills: raw.targetSoftskills || raw.softSkills || {},
    status: (raw.status as 'active' | 'closed' | 'draft') || 'active',
    salaryRange: raw.salaryRange || 'A combinar',
    experienceLevel: raw.experienceLevel || 'Pleno/Sênior',
    createdAt: raw.createAt || raw.createdAt || new Date().toISOString(),
    // Preserva propriedades originais para interoperabilidade direta com jobPosting.MD
    local: raw.local || raw.location || '',
    createAt: raw.createAt || raw.createdAt || new Date().toISOString(),
    targetHardskills: raw.targetHardskills || raw.hardSkills || [],
    targetSoftskills: raw.targetSoftskills || raw.softSkills || {},
  };
};


/**
 * Converte DTO do frontend para o formato de payload esperado pelo backend (jobPosting.MD).
 */
export const toJobPostingPayload = (data: CreateJobDTO) => ({
  companyId: String(data.companyId || ''),
  title: data.title,
  description: data.description,
  local: data.local || data.location || '',
  targetHardskills: data.targetHardskills || data.hardSkills || [],
  targetSoftskills: data.targetSoftskills || data.softSkills || {},
});

export const jobsService = {
  /**
   * Obtém vagas por empresa a partir da API real (/jobs/company/{id})
   */
  async getJobsByCompany(companyId: string, page = 0, size = 10): Promise<PaginatedJobs> {
    const response = await jobPostingApiClient.get<RawPaginatedResponse | RawJobBackend[]>(
      `/jobs/company/${companyId}?page=${page}&size=${size}`
    );
    const data = response.data;
    if (data && 'content' in data && Array.isArray(data.content)) {
      return {
        content: data.content.map(normalizeJob),
        totalElements: data.totalElements ?? data.content.length,
        totalPages: data.totalPages ?? 1,
        page: data.page ?? data.number ?? page,
        size: data.size ?? size,
      };
    }
    const list = Array.isArray(data) ? data : [];
    return {
      content: list.map(normalizeJob),
      totalElements: list.length,
      totalPages: 1,
      page,
      size,
    };
  },

  /**
   * Obtém todas as vagas com paginação (/jobs)
   */
  async getAllJobs(page = 0, size = 10, search = ''): Promise<PaginatedJobs> {
    const queryParams = new URLSearchParams({
      page: String(page),
      size: String(size),
      ...(search ? { search } : {}),
    });
    const response = await jobPostingApiClient.get<RawPaginatedResponse | RawJobBackend[]>(
      `/jobs?${queryParams.toString()}`
    );
    const data = response.data;
    if (data && 'content' in data && Array.isArray(data.content)) {
      return {
        content: data.content.map(normalizeJob),
        totalElements: data.totalElements ?? 0,
        totalPages: data.totalPages ?? 1,
        page: data.page ?? data.number ?? page,
        size: data.size ?? size,
      };
    }
    const list = Array.isArray(data) ? data : [];
    return {
      content: list.map(normalizeJob),
      totalElements: list.length,
      totalPages: 1,
      page,
      size,
    };
  },

  /**
   * Obtém detalhes de uma vaga por ID (/jobs/{id})
   */
  async getJobById(id: string): Promise<Job> {
    const response = await jobPostingApiClient.get<RawJobBackend>(`/jobs/${id}`);
    return normalizeJob(response.data);
  },

  /**
   * Cria uma nova vaga no serviço de vagas real: POST /jobs/create
   */
  async createJob(data: CreateJobDTO): Promise<Job> {
    const payload = toJobPostingPayload(data);
    const response = await jobPostingApiClient.post<RawJobBackend>('/jobs/create', payload);
    return normalizeJob(response.data);
  },

  /**
   * Atualiza uma vaga existente: PUT /jobs/{id}/edit
   */
  async updateJob(id: string, data: UpdateJobDTO): Promise<Job> {
    const payload = toJobPostingPayload(data as CreateJobDTO);
    const response = await jobPostingApiClient.put<RawJobBackend>(`/jobs/${id}/edit`, { id, ...payload });
    return normalizeJob(response.data);
  },

  /**
   * Exclui uma vaga: DELETE /jobs/{id}/delete
   */
  async deleteJob(id: string): Promise<void> {
    await jobPostingApiClient.delete(`/jobs/${id}/delete`);
  },
};


