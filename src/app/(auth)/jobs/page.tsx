'use client';

import React, { useState } from 'react';
import { useJobs } from '@/hooks/useJobs';
import { JobCard } from '@/components/jobs/JobCard';
import { JobCardSkeleton } from '@/components/common/LoadingSkeleton';
import { Briefcase, ChevronLeft, ChevronRight, Search } from 'lucide-react';

export default function JobsListPage() {
  const { jobs, isLoading, page, totalPages, fetchJobs } = useJobs();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    fetchJobs(0, value);
  };

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.hardSkills.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-8">
      {/* Top Banner & Search */}
      <div className="bg-[#1e3a5f] text-white rounded-3xl p-8 shadow-lg space-y-6">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold bg-white/10 px-3 py-1 rounded-full text-blue-200">
            <Briefcase className="h-3.5 w-3.5" /> Vagas Abertas em Tecnologia
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            Encontre sua próxima vaga tech com avaliação por IA
          </h1>
          <p className="text-sm text-slate-300">
            Candidate-se com seu PDF e participe da entrevista interativa no Telegram.
          </p>
        </div>

        {/* Search input */}
        <div className="relative max-w-xl">
          <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por cargo, empresa ou tecnologia (ex: Next.js, React)..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full rounded-2xl border border-white/10 bg-white text-slate-900 pl-12 pr-4 py-3 text-sm font-medium outline-none shadow-md placeholder:text-slate-400 focus:ring-2 focus:ring-blue-300"
          />
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Vagas Recomendadas</h2>
          <span className="text-xs text-slate-500 font-semibold">
            Exibindo {filteredJobs.length} vagas
          </span>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <JobCardSkeleton />
            <JobCardSkeleton />
            <JobCardSkeleton />
            <JobCardSkeleton />
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
            <p className="text-base font-bold text-slate-700">Nenhuma vaga encontrada</p>
            <p className="text-xs text-slate-500">Tente buscar por outros termos de pesquisa.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-6 border-t border-slate-200">
          <button
            onClick={() => fetchJobs(page - 1)}
            disabled={page === 0 || isLoading}
            className="flex items-center gap-1 text-xs font-semibold px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4" /> Anterior
          </button>
          <span className="text-xs font-bold text-slate-600">
            Página {page + 1} de {totalPages}
          </span>
          <button
            onClick={() => fetchJobs(page + 1)}
            disabled={page + 1 >= totalPages || isLoading}
            className="flex items-center gap-1 text-xs font-semibold px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Próxima <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
