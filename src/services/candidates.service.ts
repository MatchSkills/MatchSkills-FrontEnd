import { apiClient } from '@/lib/axios';
import { Candidate } from '@/types/auth';

export const candidatesService = {
  async getCandidateById(id: string): Promise<Candidate> {
    try {
      const response = await apiClient.get<Candidate>(`/candidates/${id}`);
      return response.data;
    } catch {
      return {
        id,
        name: 'Lucas Silva',
        email: 'lucas.silva@example.com',
        role: 'candidate',
        phone: '(11) 98765-4321',
      };
    }
  },

  async updateCandidate(id: string, data: Partial<Candidate>): Promise<Candidate> {
    try {
      const response = await apiClient.put<Candidate>(`/candidates/${id}`, data);
      return response.data;
    } catch {
      return {
        id,
        name: data.name || 'Lucas Silva',
        email: data.email || 'lucas.silva@example.com',
        role: 'candidate',
        phone: data.phone || '(11) 98765-4321',
      };
    }
  },

  async deleteCandidate(id: string): Promise<void> {
    await apiClient.delete(`/candidates/${id}`);
  },
};
