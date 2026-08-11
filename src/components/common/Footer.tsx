import React from 'react';
import Link from 'next/link';
import { APP_NAME, APP_SLOGAN } from '@/lib/constants';
import { Heart, Shield, Sparkles } from 'lucide-react';
import { Logo } from './Logo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#11233b] text-slate-300 border-t border-slate-800">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <Logo variant="full" theme="dark" size="md" />
            <p className="text-sm text-slate-400 max-w-sm">{APP_SLOGAN}</p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>Avaliação de Soft & Hard Skills via Método BARS</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Navegação</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/landing" className="hover:text-white transition-colors">Início</Link>
              </li>
              <li>
                <Link href="/jobs" className="hover:text-white transition-colors">Vagas Tech</Link>
              </li>
              <li>
                <Link href="/login/candidate" className="hover:text-white transition-colors">Área do Candidato</Link>
              </li>
              <li>
                <Link href="/login/company" className="hover:text-white transition-colors">Área do Recrutador</Link>
              </li>
            </ul>
          </div>

          {/* Security & Support */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Segurança & Privacidade</h4>
            <div className="space-y-2 text-xs text-slate-400">
              <p className="flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-emerald-400" /> Cookies de autenticação HttpOnly
              </p>
              <p>JWT com renovação automática de sessão</p>
              <p>© {new Date().getFullYear()} {APP_NAME}. Todos os direitos reservados.</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p className="flex items-center gap-1">
            Feito com <Heart className="h-3.5 w-3.5 text-rose-500 inline fill-rose-500" /> para recrutamento inteligente.
          </p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 transition-colors cursor-pointer">Termos de Uso</span>
            <span className="hover:text-slate-400 transition-colors cursor-pointer">Política de Privacidade</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
