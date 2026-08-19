import React from 'react';
import Link from 'next/link';
import { APP_NAME, APP_SLOGAN } from '@/lib/constants';
import { Logo } from './Logo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#11233b] text-slate-300 border-t border-slate-800">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <Logo variant="full" theme="dark" size="md" />
            <p className="text-sm text-slate-400 max-w-sm">{APP_SLOGAN}</p>
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
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} {APP_NAME}. Todos os direitos reservados.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 transition-colors cursor-pointer">Termos de Uso</span>
            <span className="hover:text-slate-400 transition-colors cursor-pointer">Política de Privacidade</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
