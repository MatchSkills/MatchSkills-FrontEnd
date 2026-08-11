'use client';

import React, { useState } from 'react';
import { Job } from '@/types/job';
import { formatDate } from '@/utils/helpers';
import { ApplicationModal } from './ApplicationModal';
import {
  ArrowLeft,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  Code2,
  MapPin,
  Send,
  Sparkles,
  Star,
} from 'lucide-react';
import Link from 'next/link';

interface JobDetailProps {
  job: Job;
}

export const JobDetail: React.FC<JobDetailProps> = ({ job }) => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link
        href="/jobs"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#1e3a5f] transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar para lista de vagas
      </Link>

      {/* Main Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#1e3a5f] bg-blue-50 px-3 py-1 rounded-full">
                <Building2 className="h-3.5 w-3.5" />
                {job.companyName}
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                <Calendar className="h-3.5 w-3.5" />
                {formatDate(job.createdAt)}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
              {job.title}
            </h1>
            <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
              <MapPin className="h-4 w-4 text-slate-400" />
              {job.location}
            </div>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1e3a5f] px-6 py-3.5 text-sm font-bold text-white shadow-md hover:bg-[#162b46] active:scale-95 transition-all shrink-0"
          >
            <Send className="h-4 w-4" /> Candidatar-se Agora
          </button>
        </div>

        {/* Description Section */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-[#1e3a5f]" /> Descrição da Vaga
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
            {job.description}
          </p>
        </div>

        {/* Hard Skills Section */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Code2 className="h-5 w-5 text-[#1e3a5f]" /> Hard Skills Requeridas
          </h2>
          <div className="flex flex-wrap gap-2">
            {job.hardSkills.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200"
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" />
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Soft Skills & Levels Section */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-500" /> Soft Skills Esperadas (Método BARS)
            </h2>
            <span className="text-xs text-slate-500 font-medium">Nível 1 a 5</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.entries(job.softSkills).map(([skill, targetLevel]) => (
              <div
                key={skill}
                className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200/80"
              >
                <span className="text-xs font-bold text-slate-800">{skill}</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= targetLevel
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-300'
                      }`}
                    />
                  ))}
                  <span className="text-xs font-semibold text-slate-600 ml-1.5">
                    {targetLevel}/5
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Action CTA */}
        <div className="pt-6 border-t border-slate-100 flex justify-end">
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#1e3a5f] px-8 py-3.5 text-sm font-bold text-white shadow-md hover:bg-[#162b46] transition-all"
          >
            <Send className="h-4 w-4" /> Enviar Candidatura
          </button>
        </div>
      </div>

      {/* Application Modal */}
      {modalOpen && <ApplicationModal job={job} onClose={() => setModalOpen(false)} />}
    </div>
  );
};
