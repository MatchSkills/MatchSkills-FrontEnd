import { apiClient } from '@/lib/axios';
import { Candidate } from '@/types/auth';

export const candidatesService = {
  async getCandidateById(id: string): Promise<Candidate> {
    const response = await apiClient.get<any>(`/candidates/${id}`);
    const data = response.data;
    return {
      id: String(data.id),
      name: data.name,
      email: data.email,
      role: 'candidate',
      phone: data.number || data.phone || '',
    };
  },

  async updateCandidate(id: string, data: Partial<Candidate>): Promise<Candidate> {
    const payload = {
      id: Number(id) || id,
      name: data.name,
      email: data.email,
      number: data.phone,
    };
    const response = await apiClient.put<any>('/candidates', payload);
    const resData = response.data;
    return {
      id: String(resData.id || id),
      name: resData.name || data.name || '',
      email: resData.email || data.email || '',
      role: 'candidate',
      phone: resData.number || resData.phone || data.phone || '',
    };
  },

  async deleteCandidate(id: string): Promise<void> {
    await apiClient.delete(`/candidates/${id}`);
  },
};
