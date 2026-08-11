'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { APP_NAME } from '@/lib/constants';
import { Logo } from './Logo';
import {
  Briefcase,
  Building2,
  ChevronDown,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  PlusCircle,
  User as UserIcon,
  X,
} from 'lucide-react';

export const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isCompany = user?.role === 'company';

  return (
    <header className="sticky top-0 z-40 bg-[#1e3a5f] text-white shadow-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo & Brand */}
          <Link href={isAuthenticated ? (isCompany ? '/dashboard' : '/jobs') : '/landing'} className="group hover:opacity-90 transition-opacity">
            <Logo variant="full" theme="dark" size="sm" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {isAuthenticated ? (
              <>
                {isCompany ? (
                  <>
                    <Link
                      href="/dashboard"
                      className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-blue-200 ${
                        pathname === '/dashboard' ? 'text-blue-300 font-semibold' : 'text-slate-200'
                      }`}
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard Ranking
                    </Link>
                    <Link
                      href="/company/jobs/create"
                      className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-blue-200 ${
                        pathname === '/company/jobs/create' ? 'text-blue-300 font-semibold' : 'text-slate-200'
                      }`}
                    >
                      <PlusCircle className="h-4 w-4" />
                      Criar Vaga
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/jobs"
                      className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-blue-200 ${
                        pathname.startsWith('/jobs') ? 'text-blue-300 font-semibold' : 'text-slate-200'
                      }`}
                    >
                      <Briefcase className="h-4 w-4" />
                      Vagas Abertas
                    </Link>
                    <Link
                      href="/my-applications"
                      className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-blue-200 ${
                        pathname === '/my-applications' ? 'text-blue-300 font-semibold' : 'text-slate-200'
                      }`}
                    >
                      <FileText className="h-4 w-4" />
                      Minhas Candidaturas
                    </Link>
                  </>
                )}
              </>
            ) : (
              <>
                <Link href="/landing" className="text-sm font-medium text-slate-200 hover:text-white transition-colors">
                  Início
                </Link>
                <Link href="/login/candidate" className="text-sm font-medium text-slate-200 hover:text-white transition-colors">
                  Sou Candidato
                </Link>
                <Link href="/login/company" className="text-sm font-medium text-slate-200 hover:text-white transition-colors">
                  Sou Recrutador
                </Link>
              </>
            )}
          </nav>

          {/* User Profile / Auth Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-3 rounded-lg bg-white/10 px-3.5 py-1.5 text-sm font-medium hover:bg-white/20 transition-all focus:outline-none"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-400/30 text-xs font-bold text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-semibold text-white leading-tight">{user.name}</span>
                    <span className="text-[10px] text-blue-200 capitalize leading-tight">
                      {user.role === 'company' ? 'Empresa' : 'Candidato'}
                    </span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-blue-200" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white text-slate-800 shadow-xl border border-slate-100 py-1.5 z-50">
                    {isCompany && (
                      <Link
                        href="/company/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <Building2 className="h-4 w-4 text-slate-500" />
                        Perfil da Empresa
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        logout();
                      }}
                      className="flex w-full items-center gap-2.5 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <LogOut className="h-4 w-4 text-rose-500" />
                      Sair da Conta
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login/candidate"
                  className="rounded-lg px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-white/10 transition-colors"
                >
                  Entrar
                </Link>
                <Link
                  href="/register/candidate"
                  className="rounded-lg bg-white px-3.5 py-1.5 text-xs font-semibold text-[#1e3a5f] hover:bg-blue-50 transition-colors shadow-sm"
                >
                  Cadastre-se Grátis
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg p-2 text-blue-200 hover:bg-white/10 hover:text-white"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#162b46] px-4 py-4 space-y-3">
          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-3 border-b border-white/10 pb-3 mb-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-400/30 font-bold text-white">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{user?.name}</div>
                  <div className="text-xs text-blue-200">{user?.email}</div>
                </div>
              </div>

              {isCompany ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 text-sm text-slate-200 py-2"
                  >
                    <LayoutDashboard className="h-4 w-4" /> Dashboard Ranking
                  </Link>
                  <Link
                    href="/company/jobs/create"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 text-sm text-slate-200 py-2"
                  >
                    <PlusCircle className="h-4 w-4" /> Criar Vaga
                  </Link>
                  <Link
                    href="/company/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 text-sm text-slate-200 py-2"
                  >
                    <Building2 className="h-4 w-4" /> Perfil da Empresa
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/jobs"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 text-sm text-slate-200 py-2"
                  >
                    <Briefcase className="h-4 w-4" /> Vagas Abertas
                  </Link>
                  <Link
                    href="/my-applications"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 text-sm text-slate-200 py-2"
                  >
                    <FileText className="h-4 w-4" /> Minhas Candidaturas
                  </Link>
                </>
              )}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="flex w-full items-center gap-2.5 text-sm font-semibold text-rose-300 py-2 border-t border-white/10 mt-2 pt-3"
              >
                <LogOut className="h-4 w-4" /> Sair
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-2 pt-2">
              <Link
                href="/login/candidate"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center rounded-lg bg-white/10 py-2 text-sm font-semibold text-white"
              >
                Entrar como Candidato
              </Link>
              <Link
                href="/login/company"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center rounded-lg bg-white py-2 text-sm font-semibold text-[#1e3a5f]"
              >
                Entrar como Recrutador
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
