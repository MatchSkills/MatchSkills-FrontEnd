'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/hooks/useAuth';
import { formatCNPJ } from '@/utils/helpers';
import { Logo } from '../common/Logo';
import {
  LoginCandidateInput,
  loginCandidateSchema,
  LoginCompanyInput,
  loginCompanySchema,
} from '@/utils/validation';
import { Briefcase, Building2, Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import { toast } from 'sonner';

interface LoginFormProps {
  initialRole?: 'candidate' | 'company';
}

export const LoginForm: React.FC<LoginFormProps> = ({ initialRole = 'candidate' }) => {
  const [activeTab, setActiveTab] = useState<'candidate' | 'company'>(initialRole);
  const [showPassword, setShowPassword] = useState(false);
  const { loginCandidate, loginCompany, isLoading } = useAuth();
  const router = useRouter();

  // Candidate Form
  const candidateForm = useForm<LoginCandidateInput>({
    resolver: zodResolver(loginCandidateSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Company Form
  const companyForm = useForm<LoginCompanyInput>({
    resolver: zodResolver(loginCompanySchema),
    defaultValues: {
      cnpj: '',
      password: '',
    },
  });

  const onCandidateSubmit = async (data: LoginCandidateInput) => {
    try {
      await loginCandidate(data);
    } catch {
      // Error handled in auth hook
    }
  };

  const onCompanySubmit = async (data: LoginCompanyInput) => {
    try {
      await loginCompany(data);
    } catch {
      // Error handled in auth hook
    }
  };

  const handleGoogleLoginPlaceholder = () => {
    toast.info('Login com Google estará disponível em breve!');
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl border border-slate-200/80 p-8">
      {/* Brand Logo */}
      <div className="flex justify-center mb-6">
        <Logo variant="stacked" theme="light" size="lg" />
      </div>

      {/* Role Selector Tabs */}
      <div className="flex rounded-xl bg-slate-100 p-1 mb-8">
        <button
          type="button"
          onClick={() => {
            setActiveTab('candidate');
            router.push('/login/candidate');
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-lg transition-all ${
            activeTab === 'candidate'
              ? 'bg-white text-[#1e3a5f] shadow-sm'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <User className="h-4 w-4" /> Candidato
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab('company');
            router.push('/login/company');
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-lg transition-all ${
            activeTab === 'company'
              ? 'bg-white text-[#1e3a5f] shadow-sm'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Building2 className="h-4 w-4" /> Recrutador (Empresa)
        </button>
      </div>

      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-[#1e3a5f]">
          {activeTab === 'candidate' ? 'Entrar como Candidato' : 'Portal da Empresa'}
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          {activeTab === 'candidate'
            ? 'Acesse para se candidatar e acompanhar suas avaliações IA'
            : 'Acesse o dashboard com ranking em 3 colunas de talentos'}
        </p>
      </div>

      {activeTab === 'candidate' ? (
        <form onSubmit={candidateForm.handleSubmit(onCandidateSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="email"
                placeholder="seu.email@exemplo.com"
                {...candidateForm.register('email')}
                className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-sm outline-none focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/10 transition-all placeholder:text-slate-400"
              />
            </div>
            {candidateForm.formState.errors.email && (
              <p className="text-xs text-rose-500 mt-1">{candidateForm.formState.errors.email.message}</p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700">Senha</label>
              <span
                onClick={() => toast.info('Link de recuperação enviado (simulação).')}
                className="text-xs text-[#1e3a5f] hover:underline cursor-pointer font-medium"
              >
                Esqueceu a senha?
              </span>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                {...candidateForm.register('password')}
                className="w-full rounded-xl border border-slate-200 pl-10 pr-10 py-2.5 text-sm outline-none focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/10 transition-all placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {candidateForm.formState.errors.password && (
              <p className="text-xs text-rose-500 mt-1">{candidateForm.formState.errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-[#1e3a5f] py-3 text-sm font-bold text-white shadow-md hover:bg-[#162b46] active:scale-[0.99] transition-all disabled:opacity-50 mt-2"
          >
            {isLoading ? 'Entrando...' : 'Entrar na Conta'}
          </button>
        </form>
      ) : (
        <form onSubmit={companyForm.handleSubmit(onCompanySubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">CNPJ da Empresa</label>
            <div className="relative">
              <Building2 className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="00.000.000/0000-00"
                {...companyForm.register('cnpj', {
                  onChange: (e) => {
                    companyForm.setValue('cnpj', formatCNPJ(e.target.value));
                  },
                })}
                className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-sm outline-none focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/10 transition-all placeholder:text-slate-400"
              />
            </div>
            {companyForm.formState.errors.cnpj && (
              <p className="text-xs text-rose-500 mt-1">{companyForm.formState.errors.cnpj.message}</p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700">Senha Corporativa</label>
              <span
                onClick={() => toast.info('Link de recuperação enviado (simulação).')}
                className="text-xs text-[#1e3a5f] hover:underline cursor-pointer font-medium"
              >
                Esqueceu a senha?
              </span>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                {...companyForm.register('password')}
                className="w-full rounded-xl border border-slate-200 pl-10 pr-10 py-2.5 text-sm outline-none focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/10 transition-all placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {companyForm.formState.errors.password && (
              <p className="text-xs text-rose-500 mt-1">{companyForm.formState.errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-[#1e3a5f] py-3 text-sm font-bold text-white shadow-md hover:bg-[#162b46] active:scale-[0.99] transition-all disabled:opacity-50 mt-2"
          >
            {isLoading ? 'Entrando...' : 'Entrar no Dashboard'}
          </button>
        </form>
      )}

      {/* Social Login Placeholder */}
      <div className="mt-6 pt-6 border-t border-slate-100">
        <button
          type="button"
          onClick={handleGoogleLoginPlaceholder}
          className="w-full flex items-center justify-center gap-3 rounded-xl border border-slate-200 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.28v3.15C3.3 21.39 7.37 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.28C.46 8.2.0 10.04.0 12s.46 3.8 1.28 5.42l4-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.3 2.61 1.28 6.58l4 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          Continuar com Google
        </button>
      </div>

      <p className="text-center text-xs text-slate-500 mt-6">
        Não possui uma conta?{' '}
        <Link
          href={activeTab === 'candidate' ? '/register/candidate' : '/register/company'}
          className="font-bold text-[#1e3a5f] hover:underline"
        >
          Cadastre-se grátis
        </Link>
      </p>
    </div>
  );
};
