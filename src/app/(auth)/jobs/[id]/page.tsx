'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { jobsService } from '@/services/jobs.service';
import { JobDetail } from '@/components/jobs/JobDetail';
import { DetailSkeleton } from '@/components/common/LoadingSkeleton';
import { Job } from '@/types/job';

export default function JobDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setIsLoading(true);
      try {
        const data = await jobsService.getJobById(id);
        setJob(data);
      } catch {
        // Handled in service
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [id]);

  if (isLoading) {
    return <DetailSkeleton />;
  }

  if (!job) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
        <p className="text-base font-bold text-slate-800">Vaga não encontrada</p>
      </div>
    );
  }

  return <JobDetail job={job} />;
}
