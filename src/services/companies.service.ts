import { apiClient } from '@/lib/axios';
import { Company } from '@/types/auth';

export const companiesService = {
  async getCompanyById(id: string): Promise<Company> {
    try {
      const response = await apiClient.get<Company>(`/companies/${id}`);
      return response.data;
    } catch {
      return {
        id,
        name: 'TechCorp Solutions',
        email: 'contato@techcorp.com',
        role: 'company',
        cnpj: '12.345.678/0001-99',
        address: 'Av. Paulista, 1000, Cj. 402 - São Paulo, SP',
      };
    }
  },

  async updateCompany(id: string, data: Partial<Company>): Promise<Company> {
    try {
      const response = await apiClient.put<Company>(`/companies/${id}`, data);
      return response.data;
    } catch {
      return {
        id,
        name: data.name || 'TechCorp Solutions',
        email: data.email || 'contato@techcorp.com',
        role: 'company',
        cnpj: data.cnpj || '12.345.678/0001-99',
        address: data.address || 'Av. Paulista, 1000, Cj. 402 - São Paulo, SP',
      };
    }
  },

  async deleteCompany(id: string): Promise<void> {
    await apiClient.delete(`/companies/${id}`);
  },
};
