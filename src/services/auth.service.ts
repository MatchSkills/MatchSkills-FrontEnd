import { apiClient, setAccessToken } from '@/lib/axios';
import {
  AuthResponse,
  LoginCandidateCredentials,
  LoginCompanyCredentials,
  RegisterCandidateDTO,
  RegisterCompanyDTO,
  User,
} from '@/types/auth';

/**
 * Normaliza respostas da API com base no formato especificado em auth.MD:
 * Response: { tokens: { accessToken, refreshToken }, candidate/company: { id, name, email, ... } }
 */
const normalizeAuthResponse = (rawResponse: any, defaultRole: 'candidate' | 'company'): AuthResponse => {
  const data = rawResponse?.data || rawResponse;
  
  // Extrai tokens
  const tokensObj = data.tokens || {};
  const token = tokensObj.accessToken || data.accessToken || data.token || data.access_token || '';
  const refreshToken = tokensObj.refreshToken || data.refreshToken || data.refresh_token || '';

  if (typeof window !== 'undefined' && refreshToken) {
    localStorage.setItem('ms_refresh_token', refreshToken);
  }

  // Extrai dados da entidade (candidate, company, user)
  const rawUser = data.candidate || data.company || data.user || data.data?.user || data.data || {};

  const user: User = {
    id: String(rawUser.id || rawUser._id || `user_${Date.now()}`),
    name: rawUser.name || rawUser.razaoSocial || rawUser.email || 'Usuário',
    email: rawUser.email || '',
    role: rawUser.role || defaultRole,
    cnpj: rawUser.cnpj,
    phone: rawUser.number || rawUser.phone || rawUser.telefone || '',
    address: rawUser.address || rawUser.endereco || '',
  };

  return { accessToken: token, user };
};

export const authService = {
  async registerCompany(data: RegisterCompanyDTO): Promise<AuthResponse> {
    const payload = {
      name: data.name,
      cnpj: data.cnpj.replace(/\D/g, ''),
      email: data.email,
      password: data.password,
      address: data.address || '',
    };
    const response = await apiClient.post('/auth/register/company', payload);
    const authData = normalizeAuthResponse(response.data, 'company');
    if (authData.accessToken) {
      setAccessToken(authData.accessToken);
    }
    return authData;
  },

  async registerCandidate(data: RegisterCandidateDTO): Promise<AuthResponse> {
    // Conforme auth.MD: POST /auth/register/candidate espera "number" (string) em vez de "phone"
    const payload = {
      name: data.name,
      email: data.email,
      password: data.password,
      number: data.phone || (data as any).number || '',
    };
    const response = await apiClient.post('/auth/register/candidate', payload);
    const authData = normalizeAuthResponse(response.data, 'candidate');
    if (authData.accessToken) {
      setAccessToken(authData.accessToken);
    }
    return authData;
  },

  async loginCompany(data: LoginCompanyCredentials): Promise<AuthResponse> {
    const payload = {
      cnpj: data.cnpj.replace(/\D/g, ''),
      password: data.password,
    };
    const response = await apiClient.post('/auth/login/company', payload);
    const authData = normalizeAuthResponse(response.data, 'company');
    if (authData.accessToken) {
      setAccessToken(authData.accessToken);
    }
    return authData;
  },

  async loginCandidate(data: LoginCandidateCredentials): Promise<AuthResponse> {
    const payload = {
      email: data.email,
      password: data.password,
    };
    const response = await apiClient.post('/auth/login/candidate', payload);
    const authData = normalizeAuthResponse(response.data, 'candidate');
    if (authData.accessToken) {
      setAccessToken(authData.accessToken);
    }
    return authData;
  },

  async logout(): Promise<void> {
    try {
      const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('ms_refresh_token') : null;
      await apiClient.post('/auth/logout', { refreshToken: refreshToken || '' });
    } catch {
      // Ignorar erros de rede no logout
    } finally {
      setAccessToken(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('ms_refresh_token');
      }
    }
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await apiClient.get('/users/me');
      const data = response.data?.candidate || response.data?.company || response.data?.user || response.data;
      if (data && data.email) {
        return {
          id: String(data.id || data._id),
          name: data.name || data.email,
          email: data.email,
          role: data.role || (data.cnpj ? 'company' : 'candidate'),
          cnpj: data.cnpj,
          phone: data.number || data.phone,
          address: data.address,
        };
      }
      return null;
    } catch {
      return null;
    }
  },
};

