import { apiClient } from '@/lib/axios';
import { CreateJobDTO, Job, PaginatedJobs, UpdateJobDTO } from '@/types/job';

// Mock list of initial jobs for development/preview
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
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
];

export const jobsService = {
  async getJobsByCompany(companyId: string, page = 0, size = 10): Promise<PaginatedJobs> {
    try {
      const response = await apiClient.get<PaginatedJobs>(
        `/jobs/company/${companyId}?page=${page}&size=${size}`
      );
      return response.data;
    } catch {
      return {
        content: mockJobsList,
        totalElements: mockJobsList.length,
        totalPages: 1,
        page,
        size,
      };
    }
  },

  async getAllJobs(page = 0, size = 10): Promise<PaginatedJobs> {
    try {
      const response = await apiClient.get<PaginatedJobs>(`/jobs?page=${page}&size=${size}`);
      return response.data;
    } catch {
      return {
        content: mockJobsList,
        totalElements: mockJobsList.length,
        totalPages: 1,
        page,
        size,
      };
    }
  },

  async getJobById(id: string): Promise<Job> {
    try {
      const response = await apiClient.get<Job>(`/jobs/${id}`);
      return response.data;
    } catch {
      const found = mockJobsList.find((j) => j.id === id);
      if (!found) {
        throw new Error('Vaga não encontrada');
      }
      return found;
    }
  },

  async createJob(data: CreateJobDTO): Promise<Job> {
    try {
      const response = await apiClient.post<Job>('/jobs/create', data);
      return response.data;
    } catch {
      const newJob: Job = {
        id: `job_${Date.now()}`,
        companyId: 'comp_1',
        companyName: 'TechCorp Solutions',
        title: data.title,
        description: data.description,
        location: data.location,
        hardSkills: data.hardSkills,
        softSkills: data.softSkills,
        createdAt: new Date().toISOString(),
      };
      mockJobsList.unshift(newJob);
      return newJob;
    }
  },

  async updateJob(id: string, data: UpdateJobDTO): Promise<Job> {
    try {
      const response = await apiClient.put<Job>(`/jobs/${id}/edit`, data);
      return response.data;
    } catch {
      const index = mockJobsList.findIndex((j) => j.id === id);
      if (index !== -1) {
        mockJobsList[index] = { ...mockJobsList[index], ...data };
        return mockJobsList[index];
      }
      throw new Error('Vaga não encontrada para atualização');
    }
  },

  async deleteJob(id: string): Promise<void> {
    try {
      await apiClient.delete(`/jobs/${id}/delete`);
    } catch {
      const index = mockJobsList.findIndex((j) => j.id === id);
      if (index !== -1) {
        mockJobsList.splice(index, 1);
      }
    }
  },
};
