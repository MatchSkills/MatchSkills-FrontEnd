'use client';

import React from 'react';
import { RankingFilters } from '@/types/ranking';
import { AVAILABLE_SOFT_SKILLS } from '@/constants/skills';
import { Filter, RefreshCw, SlidersHorizontal, Sparkles } from 'lucide-react';

interface RankingFiltersProps {
  filters: RankingFilters;
  onFilterChange: (newFilters: RankingFilters) => void;
  onRefresh: () => void;
  isLoading: boolean;
}

export const RankingFiltersComponent: React.FC<RankingFiltersProps> = ({
  filters,
  onFilterChange,
  onRefresh,
  isLoading,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5 text-[#1e3a5f]" />
          <h3 className="text-sm font-bold text-slate-900">Filtros do Ranking BARS</h3>
        </div>

        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1e3a5f] bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          Atualizar Ranking
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Soft Skill Dropdown */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Soft Skill Específica
          </label>
          <select
            value={filters.softSkill || ''}
            onChange={(e) =>
              onFilterChange({ ...filters, softSkill: e.target.value || undefined })
            }
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium outline-none focus:border-[#1e3a5f]"
          >
            <option value="">Todas as Soft Skills</option>
            {AVAILABLE_SOFT_SKILLS.map((skill) => (
              <option key={skill} value={skill}>
                {skill}
              </option>
            ))}
          </select>
        </div>

        {/* Hard Skill Dropdown */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Hard Skill Específica
          </label>
          <select
            value={filters.hardSkill || ''}
            onChange={(e) =>
              onFilterChange({ ...filters, hardSkill: e.target.value || undefined })
            }
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium outline-none focus:border-[#1e3a5f]"
          >
            <option value="">Todas as Hard Skills</option>
            <option value="Next.js">Next.js</option>
            <option value="React">React</option>
            <option value="TypeScript">TypeScript</option>
            <option value="Tailwind CSS">Tailwind CSS</option>
          </select>
        </div>

        {/* Score Min Slider */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-semibold text-slate-700">
              Score Mínimo (Média BARS)
            </label>
            <span className="text-xs font-bold text-[#1e3a5f]">
              {filters.minScore || 0} pts
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={filters.minScore || 0}
            onChange={(e) =>
              onFilterChange({ ...filters, minScore: Number(e.target.value) })
            }
            className="w-full accent-[#1e3a5f] cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
