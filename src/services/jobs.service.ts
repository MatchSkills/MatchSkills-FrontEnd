import { jobPostingApiClient, mockApiClient } from '@/lib/axios';
import { CreateJobDTO, Job, PaginatedJobs, UpdateJobDTO } from '@/types/job';

/**
 * Normaliza objetos de vaga do backend (jobPosting.MD) para o formato padrão do frontend.
 * Converte:
 * - local -> location
 * - createAt -> createdAt
 * - targetHardskills -> hardSkills
 * - targetSoftskills -> softSkills
 */
export const normalizeJob = (raw: any): Job => {
  if (!raw) return raw;
  return {
    id: String(raw.id || `job_${Date.now()}`),
    companyId: String(raw.companyId || 'comp_1'),
    companyName: raw.companyName || 'Empresa Parceira',
    title: raw.title || '',
    description: raw.description || '',
    location: raw.local || raw.location || '',
    hardSkills: raw.targetHardskills || raw.hardSkills || [],
    softSkills: raw.targetSoftskills || raw.softSkills || {},
    status: raw.status || 'active',
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
  companyId: String(data.companyId || 'comp_1'),
  title: data.title,
  description: data.description,
  local: data.local || data.location || '',
  targetHardskills: data.targetHardskills || data.hardSkills || [],
  targetSoftskills: data.targetSoftskills || data.softSkills || {},
});

// Lista de vagas em memória como fallback defensivo
const mockJobsList: Job[] = [
  {
    id: 'job_1',
    companyId: 'comp_1',
    companyName: 'TechCorp Solutions',
    title: 'Desenvolvedor Frontend Senior (Next.js)',
    description:
      'Procuramos desenvolvedor frontend sênior com vivência sólida em Next.js App Router, TypeScript e Tailwind CSS para integrar time de alta performance em plataforma SaaS.',
    location: 'São Paulo, SP (Híbrido)',
    hardSkills: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Axios'],
    softSkills: { Comunicação: 5, Liderança: 4, 'Resolução de Problemas': 5, Proatividade: 4 },
    status: 'active',
    salaryRange: 'R$ 12.000 - R$ 16.000',
    experienceLevel: 'Sênior',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 'job_2',
    companyId: 'comp_1',
    companyName: 'TechCorp Solutions',
    title: 'Engenheiro de IA & Machine Learning',
    description:
      'Vaga para atuar na criação de modelos BARS e agentes de IA para avaliação comportamental e mapeamento de perfis de profissionais tech.',
    location: 'Remoto',
    hardSkills: ['Python', 'PyTorch', 'LangChain', 'FastAPI', 'Docker'],
    softSkills: { 'Pensamento Crítico': 5, 'Trabalho em Equipe': 4, Autonomia: 5 },
    status: 'active',
    salaryRange: 'R$ 14.000 - R$ 18.000',
    experienceLevel: 'Sênior / Especialista',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'job_3',
    companyId: 'comp_2',
    companyName: 'Innovate Tech Labs',
    title: 'Desenvolvedor Fullstack Node.js / React',
    description:
      'Desenvolvimento de APIs RESTful e aplicações dinâmicas em microserviços Node.js e interfaces modernas em React.',
    location: 'Florianópolis, SC (Remoto)',
    hardSkills: ['Node.js', 'React', 'PostgreSQL', 'Docker', 'Jest'],
    softSkills: { Organização: 4, Flexibilidade: 4, Empatia: 4 },
    status: 'active',
    salaryRange: 'R$ 8.000 - R$ 11.000',
    experienceLevel: 'Pleno',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
];

export const jobsService = {
  /**
   * Obtém vagas por empresa a partir da API real (/jobs/company/{id})
   */
  async getJobsByCompany(companyId: string, page = 0, size = 10): Promise<PaginatedJobs> {
    try {
      const response = await jobPostingApiClient.get<any>(
        `/jobs/company/${companyId}?page=${page}&size=${size}`
      );
      if (response.data?.content) {
        return {
          content: response.data.content.map(normalizeJob),
          totalElements: response.data.totalElements ?? response.data.content.length,
          totalPages: response.data.totalPages ?? 1,
          page: response.data.page ?? response.data.number ?? page,
          size: response.data.size ?? size,
        };
      }
    } catch {
      // Tenta fallback via mockApiClient se disponível
      try {
        const mockResponse = await mockApiClient.get<any>(
          `/api/mock/jobs/company/${companyId}?page=${page}&size=${size}`
        );
        if (mockResponse.data?.content) {
          return {
            content: mockResponse.data.content.map(normalizeJob),
            totalElements: mockResponse.data.totalElements || mockResponse.data.content.length,
            totalPages: mockResponse.data.totalPages || 1,
            page: mockResponse.data.page ?? mockResponse.data.number ?? page,
            size: mockResponse.data.size ?? size,
          };
        }
      } catch {
        // Fallback local em memória
      }
    }

    const filtered = mockJobsList.filter((j) => j.companyId === companyId);
    const listToReturn = filtered.length > 0 ? filtered : mockJobsList;
    return {
      content: listToReturn,
      totalElements: listToReturn.length,
      totalPages: 1,
      page,
      size,
    };
  },

  /**
   * Obtém todas as vagas com paginação (/jobs)
   */
  async getAllJobs(page = 0, size = 10, search = ''): Promise<PaginatedJobs> {
    try {
      const queryParams = new URLSearchParams({
        page: String(page),
        size: String(size),
        ...(search ? { search } : {}),
      });
      const response = await jobPostingApiClient.get<any>(`/jobs?${queryParams.toString()}`);
      if (response.data?.content) {
        return {
          content: (response.data.content || []).map(normalizeJob),
          totalElements: response.data.totalElements || 0,
          totalPages: response.data.totalPages || 1,
          page: response.data.page ?? response.data.number ?? page,
          size: response.data.size ?? size,
        };
      }
    } catch {
      try {
        const queryParams = new URLSearchParams({
          page: String(page),
          size: String(size),
          ...(search ? { search } : {}),
        });
        const mockResponse = await mockApiClient.get<any>(`/api/mock/jobs?${queryParams.toString()}`);
        if (mockResponse.data?.content) {
          return {
            content: (mockResponse.data.content || []).map(normalizeJob),
            totalElements: mockResponse.data.totalElements || 0,
            totalPages: mockResponse.data.totalPages || 1,
            page: mockResponse.data.page ?? mockResponse.data.number ?? page,
            size: mockResponse.data.size ?? size,
          };
        }
      } catch {
        // Fallback local
      }
    }

    let filtered = [...mockJobsList];
    if (search) {
      const query = search.toLowerCase();
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(query) ||
          job.companyName.toLowerCase().includes(query) ||
          job.location.toLowerCase().includes(query) ||
          job.hardSkills.some((s) => s.toLowerCase().includes(query))
      );
    }
    return {
      content: filtered,
      totalElements: filtered.length,
      totalPages: Math.ceil(filtered.length / size) || 1,
      page,
      size,
    };
  },

  /**
   * Obtém detalhes de uma vaga por ID (/jobs/{id})
   */
  async getJobById(id: string): Promise<Job> {
    try {
      const response = await jobPostingApiClient.get<any>(`/jobs/${id}`);
      return normalizeJob(response.data);
    } catch {
      try {
        const mockResponse = await mockApiClient.get<any>(`/api/mock/jobs/${id}`);
        return normalizeJob(mockResponse.data);
      } catch {
        const found = mockJobsList.find((j) => j.id === id);
        if (!found) {
          throw new Error('Vaga não encontrada');
        }
        return found;
      }
    }
  },

  /**
   * Cria uma nova vaga no serviço de vagas real: POST /jobs/create
   */
  async createJob(data: CreateJobDTO): Promise<Job> {
    const payload = toJobPostingPayload(data);
    try {
      const response = await jobPostingApiClient.post<any>('/jobs/create', payload);
      const normalized = normalizeJob(response.data);
      if (normalized) {
        mockJobsList.unshift(normalized);
      }
      return normalized;
    } catch (error: any) {
      console.error('[jobsService.createJob] Erro na requisição:', {
        status: error?.response?.status,
        data: error?.response?.data,
        message: error?.message,
      });

      // Se falhar o backend real, gera vaga fallback e adiciona em memória para dev
      const newJob: Job = {
        id: `job_${Date.now()}`,
        companyId: String(data.companyId || 'comp_1'),
        companyName: data.companyName || 'TechCorp Solutions',
        title: data.title,
        description: data.description,
        location: data.local || data.location || '',
        hardSkills: data.targetHardskills || data.hardSkills || [],
        softSkills: data.targetSoftskills || data.softSkills || {},
        status: data.status || 'active',
        salaryRange: data.salaryRange || 'A combinar',
        experienceLevel: data.experienceLevel || 'Pleno/Sênior',
        createdAt: new Date().toISOString(),
      };
      mockJobsList.unshift(newJob);
      return newJob;
    }
  },

  /**
   * Atualiza uma vaga existente: PUT /jobs/{id}/edit
   */
  async updateJob(id: string, data: UpdateJobDTO): Promise<Job> {
    const payload = toJobPostingPayload(data as CreateJobDTO);
    try {
      const response = await jobPostingApiClient.put<any>(`/jobs/${id}/edit`, { id, ...payload });
      return normalizeJob(response.data);
    } catch {
      const index = mockJobsList.findIndex((j) => j.id === id);
      if (index !== -1) {
        mockJobsList[index] = { ...mockJobsList[index], ...data };
        return mockJobsList[index];
      }
      throw new Error('Vaga não encontrada para atualização');
    }
  },

  /**
   * Exclui uma vaga: DELETE /jobs/{id}/delete
   */
  async deleteJob(id: string): Promise<void> {
    try {
      await jobPostingApiClient.delete(`/jobs/${id}/delete`);
      const index = mockJobsList.findIndex((j) => j.id === id);
      if (index !== -1) {
        mockJobsList.splice(index, 1);
      }
    } catch {
      const index = mockJobsList.findIndex((j) => j.id === id);
      if (index !== -1) {
        mockJobsList.splice(index, 1);
      }
    }
  },
};
