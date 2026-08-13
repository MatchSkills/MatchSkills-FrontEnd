import { apiClient } from '@/lib/axios';
import { Company } from '@/types/auth';

export const companiesService = {
  async getCompanyById(id: string): Promise<Company> {
    const response = await apiClient.get<any>(`/companies/${id}`);
    const data = response.data;
    return {
      id: String(data.id),
      name: data.name,
      email: data.email,
      role: 'company',
      cnpj: data.cnpj,
      address: data.address,
    };
  },

  async updateCompany(id: string, data: Partial<Company>): Promise<Company> {
    const payload = {
      id: Number(id) || id,
      name: data.name,
      email: data.email,
      address: data.address,
    };
    const response = await apiClient.put<any>('/companies', payload);
    const resData = response.data;
    return {
      id: String(resData.id || id),
      name: resData.name || data.name || '',
      email: resData.email || data.email || '',
      role: 'company',
      cnpj: resData.cnpj || data.cnpj || '',
      address: resData.address || data.address || '',
    };
  },

  async deleteCompany(id: string): Promise<void> {
    await apiClient.delete(`/companies/${id}`);
  },
};
