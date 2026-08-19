import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { Logo } from '@/components/common/Logo';
import { APP_NAME, APP_SLOGAN } from '@/lib/constants';
import {
  ArrowRight,
  Award,
  Bot,
  Brain,
  Briefcase,
  CheckCircle2,
  FileCheck2,
  LayoutDashboard,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#f8fafc]">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#1e3a5f] via-[#162b46] to-[#0f172a] text-white py-20 lg:py-28 px-4 sm:px-6 lg:px-8">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent"></div>
          
          <div className="relative max-w-5xl mx-auto text-center space-y-8">
            <div className="flex justify-center">
              <Logo variant="stacked" theme="dark" size="xl" />
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold text-blue-200 border border-white/10 backdrop-blur-md">
              <Sparkles className="h-4 w-4 text-amber-400" />
              Recrutamento Inteligente com Método BARS & IA
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight text-white">
              {APP_SLOGAN}
            </h1>

            <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
              Conectamos candidatos a oportunidades reais através de um fluxo automatizado com bots no Telegram, inteligência artificial e um dashboard exclusivo com ranking em 3 colunas.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/login/company"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl bg-white px-7 py-4 text-sm font-bold text-[#1e3a5f] shadow-lg hover:bg-blue-50 active:scale-95 transition-all"
              >
                <Briefcase className="h-5 w-5" /> Entrar como Recrutador
              </Link>
              <Link
                href="/login/candidate"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl bg-blue-600/30 border border-blue-400/30 backdrop-blur-md px-7 py-4 text-sm font-bold text-white hover:bg-blue-600/50 active:scale-95 transition-all"
              >
                <Users className="h-5 w-5" /> Entrar como Candidato
              </Link>
            </div>
          </div>
        </section>

        {/* 3 Main Features */}
        <section className="py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Como o {APP_NAME} transforma o processo seletivo
            </h2>
            <p className="text-sm text-slate-600">
              Simplificamos a triagem técnica e comportamental unindo bots acessíveis e avaliação padronizada BARS.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-sm hover:shadow-md transition-all space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 font-bold">
                <FileCheck2 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">1. Candidatura Simplificada</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Envio rápido de currículo em formato PDF (&lt;5MB) diretamente na vaga de interesse, gerando imediatamente seu protocolo seguro.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-sm hover:shadow-md transition-all space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600 font-bold">
                <Bot className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">2. Bot Interativo no Telegram</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                O candidato recebe um deep-link para conversar com o bot IA no Telegram, respondendo perguntas técnicas e extraindo soft/hard skills.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-sm hover:shadow-md transition-all space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 font-bold">
                <LayoutDashboard className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">3. Dashboard com Ranking 3 Colunas</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Recrutadores acessam um painel em tempo real ordenado por Soft Skills, Hard Skills e Score Médio com indicadores de cores 🟢 🟡 🔴.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
