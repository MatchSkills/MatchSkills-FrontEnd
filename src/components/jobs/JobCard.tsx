import React from 'react';
import Link from 'next/link';
import { Job } from '@/types/job';
import { formatDate } from '@/utils/helpers';
import { ArrowRight, Briefcase, Building2, Calendar, MapPin, Sparkles } from 'lucide-react';

interface JobCardProps {
  job: Job;
}

export const JobCard: React.FC<JobCardProps> = ({ job }) => {
  return (
    <div className="group rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm hover:shadow-md hover:border-blue-200 transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1e3a5f] bg-blue-50 px-2.5 py-1 rounded-full mb-2">
              <Building2 className="h-3 w-3" />
              {job.companyName}
            </span>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#1e3a5f] transition-colors leading-snug">
              {job.title}
            </h3>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full shrink-0">
            <MapPin className="h-3.5 w-3.5 text-slate-400" />
            {job.location}
          </span>
        </div>

        <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
          {job.description}
        </p>

        {/* Hard Skills Badges */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {job.hardSkills.map((skill, index) => (
            <span
              key={index}
              className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-2">
        <span className="text-[11px] text-slate-400 flex items-center gap-1">
          <Calendar className="h-3 w-3" /> Publicada em {formatDate(job.createdAt)}
        </span>

        <Link
          href={`/jobs/${job.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#1e3a5f] px-4 py-2 rounded-xl hover:bg-[#162b46] active:scale-95 transition-all shadow-sm"
        >
          Ver detalhes <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
};
