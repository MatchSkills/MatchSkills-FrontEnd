'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useJobs } from '@/hooks/useJobs';
import { useRanking } from '@/hooks/useRanking';
import { RankingFiltersComponent } from '@/components/dashboard/RankingFilters';
import { RankingTable } from '@/components/dashboard/RankingTable';
import { RankingSkeleton } from '@/components/common/LoadingSkeleton';
import { Briefcase, Building2, ChevronDown, LayoutDashboard, PlusCircle, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();
  const { jobs, isLoading: isJobsLoading } = useJobs(user?.id);
  const {
    jobId,
    setJobId,
    applicants,
    filters,
    setFilters,
    isLoading: isRankingLoading,
    refreshRanking,
  } = useRanking(jobs[0]?.id || 'job_1');

  React.useEffect(() => {
    if (jobs.length > 0 && (!jobId || !jobs.some((j) => j.id === jobId))) {
      setJobId(jobs[0].id);
    }
  }, [jobs, jobId, setJobId]);

  const selectedJobObj = jobs.find((j) => j.id === jobId) || jobs[0];
  const isLoading = isJobsLoading || isRankingLoading;

  return (
    <div className="space-y-8">
      {/* Top Header Card */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#1e3a5f] text-white rounded-3xl p-8 shadow-lg">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold bg-white/10 px-3 py-1 rounded-full text-blue-200">
            <LayoutDashboard className="h-3.5 w-3.5" /> Dashboard de Recrutamento IA
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            Ranking de Candidatos por BARS Method
          </h1>
          <p className="text-sm text-slate-300">
            Visualização comparativa em 3 colunas: Soft Skills, Hard Skills e Score Médio.
          </p>
        </div>

        {/* Create Job CTA */}
        <Link
          href="/company/jobs/create"
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-xs font-bold text-[#1e3a5f] shadow-md hover:bg-blue-50 active:scale-95 transition-all shrink-0"
        >
          <PlusCircle className="h-4 w-4" /> Criar Nova Vaga
        </Link>
      </div>

      {/* Job Selector Dropdown Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#1e3a5f]">
            <Briefcase className="h-5 w-5" />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Vaga Selecionada
            </label>
            <div className="relative mt-0.5">
              <select
                value={jobId}
                onChange={(e) => setJobId(e.target.value)}
                className="appearance-none font-bold text-slate-900 bg-transparent pr-8 text-sm outline-none cursor-pointer"
              >
                {jobs.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.title} ({job.location})
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-0 top-1 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {selectedJobObj && (
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
            <Building2 className="h-4 w-4 text-slate-400" />
            <span>{selectedJobObj.companyName}</span>
          </div>
        )}
      </div>

      {/* Interactive Filters */}
      <RankingFiltersComponent
        filters={filters}
        onFilterChange={setFilters}
        onRefresh={refreshRanking}
        isLoading={isLoading}
      />

      {/* 3-Column Ranking Table */}
      {isLoading ? (
        <RankingSkeleton />
      ) : (
        <RankingTable applicants={applicants} isLoading={isLoading} />
      )}
    </div>
  );
}
