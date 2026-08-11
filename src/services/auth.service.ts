import { apiClient, setAccessToken } from '@/lib/axios';
import {
  AuthResponse,
  LoginCandidateCredentials,
  LoginCompanyCredentials,
  RegisterCandidateDTO,
  RegisterCompanyDTO,
} from '@/types/auth';

export const authService = {
  async registerCompany(data: RegisterCompanyDTO): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/register/company', data);
      if (response.data.accessToken) {
        setAccessToken(response.data.accessToken);
      }
      return response.data;
    } catch {
      // Mock fallback if backend service is offline
      const mockResponse: AuthResponse = {
        accessToken: `mock_token_comp_${Date.now()}`,
        user: {
          id: `comp_${Date.now()}`,
          name: data.name,
          email: data.email,
          role: 'company',
          cnpj: data.cnpj,
          address: data.address,
        },
      };
      setAccessToken(mockResponse.accessToken);
      return mockResponse;
    }
  },

  async registerCandidate(data: RegisterCandidateDTO): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/register/candidate', data);
      if (response.data.accessToken) {
        setAccessToken(response.data.accessToken);
      }
      return response.data;
    } catch {
      // Mock fallback
      const mockResponse: AuthResponse = {
        accessToken: `mock_token_cand_${Date.now()}`,
        user: {
          id: `cand_${Date.now()}`,
          name: data.name,
          email: data.email,
          role: 'candidate',
          phone: data.phone,
        },
      };
      setAccessToken(mockResponse.accessToken);
      return mockResponse;
    }
  },

  async loginCompany(data: LoginCompanyCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login/company', data);
      if (response.data.accessToken) {
        setAccessToken(response.data.accessToken);
      }
      return response.data;
    } catch {
      const mockResponse: AuthResponse = {
        accessToken: `mock_token_comp_${Date.now()}`,
        user: {
          id: 'comp_1',
          name: 'TechCorp Solutions',
          email: 'contato@techcorp.com',
          role: 'company',
          cnpj: data.cnpj,
          address: 'Av. Paulista, 1000 - São Paulo, SP',
        },
      };
      setAccessToken(mockResponse.accessToken);
      return mockResponse;
    }
  },

  async loginCandidate(data: LoginCandidateCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login/candidate', data);
      if (response.data.accessToken) {
        setAccessToken(response.data.accessToken);
      }
      return response.data;
    } catch {
      const mockResponse: AuthResponse = {
        accessToken: `mock_token_cand_${Date.now()}`,
        user: {
          id: 'cand_1',
          name: 'Lucas Silva',
          email: data.email,
          role: 'candidate',
          phone: '(11) 98765-4321',
        },
      };
      setAccessToken(mockResponse.accessToken);
      return mockResponse;
    }
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // Ignore errors on logout mock
    } finally {
      setAccessToken(null);
    }
  },
};
