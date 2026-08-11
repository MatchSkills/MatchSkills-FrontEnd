'use client';

import React from 'react';
import { RankingApplicant } from '@/types/ranking';
import { getBarsBadgeColor } from '@/utils/helpers';
import { Award, BrainCircuit, Code, Sparkles, User, Zap } from 'lucide-react';

interface RankingTableProps {
  applicants: RankingApplicant[];
  isLoading: boolean;
}

export const RankingTable: React.FC<RankingTableProps> = ({ applicants, isLoading }) => {
  if (applicants.length === 0 && !isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
        <BrainCircuit className="h-10 w-10 text-slate-300 mx-auto" />
        <h3 className="text-base font-bold text-slate-700">Nenhum candidato encontrado</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Não há candidaturas avaliadas com os filtros selecionados. Tente ajustar o score mínimo ou aguarde novas avaliações do Telegram.
        </p>
      </div>
    );
  }

  // Generate 3 sorted lists for the 3 columns
  const softSkillSorted = [...applicants].sort((a, b) => b.softSkillScore - a.softSkillScore);
  const hardSkillSorted = [...applicants].sort((a, b) => b.hardSkillScore - a.hardSkillScore);
  const averageSorted = [...applicants].sort((a, b) => b.averageScore - a.averageScore);

  return (
    <div className="space-y-6">
      {/* 3 Columns Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1: Soft Skills Ranking */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col">
          <div className="bg-[#1e3a5f]/5 border-b border-slate-200 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <h3 className="text-sm font-bold text-slate-900">1. Soft Skills Ranking</h3>
            </div>
            <span className="text-[11px] font-semibold text-slate-500">BARS Method</span>
          </div>

          <div className="divide-y divide-slate-100 p-2 overflow-x-auto">
            {softSkillSorted.map((item, index) => {
              const badge = getBarsBadgeColor(item.softSkillScore);
              return (
                <div
                  key={item.candidateId}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors gap-2"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700">
                      #{index + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">{item.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{item.status}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.bg} ${badge.text} ${badge.border}`}>
                      {badge.icon} {item.softSkillScore} pts
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Column 2: Hard Skills Ranking */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col">
          <div className="bg-[#1e3a5f]/5 border-b border-slate-200 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code className="h-4 w-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">2. Hard Skills Ranking</h3>
            </div>
            <span className="text-[11px] font-semibold text-slate-500">BARS Method</span>
          </div>

          <div className="divide-y divide-slate-100 p-2 overflow-x-auto">
            {hardSkillSorted.map((item, index) => {
              const badge = getBarsBadgeColor(item.hardSkillScore);
              return (
                <div
                  key={item.candidateId}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors gap-2"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700">
                      #{index + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">{item.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{item.status}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.bg} ${badge.text} ${badge.border}`}>
                      {badge.icon} {item.hardSkillScore} pts
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Column 3: Average Ranking */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col">
          <div className="bg-[#1e3a5f]/5 border-b border-slate-200 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900">3. Average Ranking</h3>
            </div>
            <span className="text-[11px] font-semibold text-slate-500">Score Geral</span>
          </div>

          <div className="divide-y divide-slate-100 p-2 overflow-x-auto">
            {averageSorted.map((item, index) => {
              const badge = getBarsBadgeColor(item.averageScore);
              return (
                <div
                  key={item.candidateId}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors gap-2"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#1e3a5f] text-xs font-bold text-white">
                      #{index + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">{item.name}</p>
                      <span className="text-[10px] text-slate-400 block truncate">{badge.label}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[11px] font-extrabold px-2.5 py-1 rounded-full border ${badge.bg} ${badge.text} ${badge.border}`}>
                      {badge.icon} {item.averageScore} pts
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
