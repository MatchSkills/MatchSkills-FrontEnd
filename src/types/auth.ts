export type UserRole = 'candidate' | 'company';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  cnpj?: string;
  phone?: string;
  address?: string;
}

export interface Candidate extends User {
  role: 'candidate';
  phone?: string;
}

export interface Company extends User {
  role: 'company';
  cnpj: string;
  address?: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface LoginCompanyCredentials {
  cnpj: string;
  password: string;
}

export interface LoginCandidateCredentials {
  email: string;
  password: string;
}

export interface RegisterCompanyDTO {
  name: string;
  cnpj: string;
  email: string;
  password: string;
  address?: string;
}

export interface RegisterCandidateDTO {
  name: string;
  email: string;
  phone: string;
  password: string;
}
