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
  RegisterCandidateInput,
  registerCandidateSchema,
  RegisterCompanyInput,
  registerCompanySchema,
} from '@/utils/validation';
import { Briefcase, Building2, Eye, EyeOff, Lock, Mail, MapPin, Phone, User } from 'lucide-react';

interface RegisterFormProps {
  initialRole?: 'candidate' | 'company';
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ initialRole = 'candidate' }) => {
  const [activeTab, setActiveTab] = useState<'candidate' | 'company'>(initialRole);
  const [showPassword, setShowPassword] = useState(false);
  const { registerCandidate, registerCompany, isLoading } = useAuth();
  const router = useRouter();

  const candidateForm = useForm<RegisterCandidateInput>({
    resolver: zodResolver(registerCandidateSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      acceptTerms: true,
    },
  });

  const companyForm = useForm<RegisterCompanyInput>({
    resolver: zodResolver(registerCompanySchema),
    defaultValues: {
      name: '',
      cnpj: '',
      email: '',
      password: '',
      address: '',
      acceptTerms: true,
    },
  });

  const onCandidateSubmit = async (data: RegisterCandidateInput) => {
    try {
      await registerCandidate({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
      });
    } catch {
      // Handled in context
    }
  };

  const onCompanySubmit = async (data: RegisterCompanyInput) => {
    try {
      await registerCompany({
        name: data.name,
        cnpj: data.cnpj,
        email: data.email,
        password: data.password,
        address: data.address,
      });
    } catch {
      // Handled in context
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-white rounded-2xl shadow-xl border border-slate-200/80 p-8">
      {/* Brand Logo */}
      <div className="flex justify-center mb-6">
        <Logo variant="stacked" theme="light" size="lg" />
      </div>

      {/* Role Tabs */}
      <div className="flex rounded-xl bg-slate-100 p-1 mb-6">
        <button
          type="button"
          onClick={() => {
            setActiveTab('candidate');
            router.push('/register/candidate');
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
            router.push('/register/company');
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
          {activeTab === 'candidate' ? 'Criar Conta de Candidato' : 'Cadastrar Sua Empresa'}
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          {activeTab === 'candidate'
            ? 'Cadastre-se para concorrer às melhores vagas tech com IA'
            : 'Encontre e avalie os melhores talentos tech com Método BARS'}
        </p>
      </div>

      {activeTab === 'candidate' ? (
        <form onSubmit={candidateForm.handleSubmit(onCandidateSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Nome Completo</label>
            <div className="relative">
              <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Ex: Lucas Silva"
                {...candidateForm.register('name')}
                className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-sm outline-none focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/10"
              />
            </div>
            {candidateForm.formState.errors.name && (
              <p className="text-xs text-rose-500 mt-1">{candidateForm.formState.errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="email"
                placeholder="seu.email@exemplo.com"
                {...candidateForm.register('email')}
                className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-sm outline-none focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/10"
              />
            </div>
            {candidateForm.formState.errors.email && (
              <p className="text-xs text-rose-500 mt-1">{candidateForm.formState.errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Telefone (WhatsApp)</label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="(11) 98765-4321"
                {...candidateForm.register('phone')}
                className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-sm outline-none focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/10"
              />
            </div>
            {candidateForm.formState.errors.phone && (
              <p className="text-xs text-rose-500 mt-1">{candidateForm.formState.errors.phone.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Senha</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Mínimo 6 caracteres"
                {...candidateForm.register('password')}
                className="w-full rounded-xl border border-slate-200 pl-10 pr-10 py-2.5 text-sm outline-none focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/10"
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

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="terms-cand"
              {...candidateForm.register('acceptTerms')}
              className="rounded border-slate-300 text-[#1e3a5f] focus:ring-[#1e3a5f]"
            />
            <label htmlFor="terms-cand" className="text-xs text-slate-600">
              Aceito os <span className="font-semibold text-[#1e3a5f]">termos de serviço</span> e política de privacidade.
            </label>
          </div>
          {candidateForm.formState.errors.acceptTerms && (
            <p className="text-xs text-rose-500">{candidateForm.formState.errors.acceptTerms.message}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-[#1e3a5f] py-3 text-sm font-bold text-white shadow-md hover:bg-[#162b46] active:scale-[0.99] transition-all disabled:opacity-50 mt-2"
          >
            {isLoading ? 'Criando Conta...' : 'Criar Conta de Candidato'}
          </button>
        </form>
      ) : (
        <form onSubmit={companyForm.handleSubmit(onCompanySubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Nome da Empresa</label>
            <div className="relative">
              <Building2 className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Ex: TechCorp Solutions"
                {...companyForm.register('name')}
                className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-sm outline-none focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/10"
              />
            </div>
            {companyForm.formState.errors.name && (
              <p className="text-xs text-rose-500 mt-1">{companyForm.formState.errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">CNPJ</label>
            <div className="relative">
              <Building2 className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="00.000.000/0000-00"
                {...companyForm.register('cnpj', {
                  onChange: (e) => companyForm.setValue('cnpj', formatCNPJ(e.target.value)),
                })}
                className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-sm outline-none focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/10"
              />
            </div>
            {companyForm.formState.errors.cnpj && (
              <p className="text-xs text-rose-500 mt-1">{companyForm.formState.errors.cnpj.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">E-mail Corporativo</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="email"
                placeholder="contato@empresa.com"
                {...companyForm.register('email')}
                className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-sm outline-none focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/10"
              />
            </div>
            {companyForm.formState.errors.email && (
              <p className="text-xs text-rose-500 mt-1">{companyForm.formState.errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Endereço da Empresa</label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Av. Paulista, 1000 - São Paulo, SP"
                {...companyForm.register('address')}
                className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-sm outline-none focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/10"
              />
            </div>
            {companyForm.formState.errors.address && (
              <p className="text-xs text-rose-500 mt-1">{companyForm.formState.errors.address.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Senha Corporativa</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Mínimo 6 caracteres"
                {...companyForm.register('password')}
                className="w-full rounded-xl border border-slate-200 pl-10 pr-10 py-2.5 text-sm outline-none focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/10"
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

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="terms-comp"
              {...companyForm.register('acceptTerms')}
              className="rounded border-slate-300 text-[#1e3a5f] focus:ring-[#1e3a5f]"
            />
            <label htmlFor="terms-comp" className="text-xs text-slate-600">
              Aceito os <span className="font-semibold text-[#1e3a5f]">termos de serviço</span> e política de recrutamento.
            </label>
          </div>
          {companyForm.formState.errors.acceptTerms && (
            <p className="text-xs text-rose-500">{companyForm.formState.errors.acceptTerms.message}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-[#1e3a5f] py-3 text-sm font-bold text-white shadow-md hover:bg-[#162b46] active:scale-[0.99] transition-all disabled:opacity-50 mt-2"
          >
            {isLoading ? 'Cadastrando Empresa...' : 'Cadastrar Empresa'}
          </button>
        </form>
      )}

      <p className="text-center text-xs text-slate-500 mt-6">
        Já possui uma conta?{' '}
        <Link
          href={activeTab === 'candidate' ? '/login/candidate' : '/login/company'}
          className="font-bold text-[#1e3a5f] hover:underline"
        >
          Entrar na conta
        </Link>
      </p>
    </div>
  );
};
