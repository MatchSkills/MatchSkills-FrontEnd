import React from 'react';

export const JobCardSkeleton: React.FC = () => {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm animate-pulse space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <div className="h-6 w-2/3 rounded-md bg-slate-200"></div>
          <div className="h-4 w-1/3 rounded-md bg-slate-100"></div>
        </div>
        <div className="h-8 w-24 rounded-full bg-slate-200"></div>
      </div>
      <div className="h-12 w-full rounded-md bg-slate-100"></div>
      <div className="flex gap-2 pt-2">
        <div className="h-6 w-16 rounded-md bg-slate-200"></div>
        <div className="h-6 w-20 rounded-md bg-slate-200"></div>
        <div className="h-6 w-24 rounded-md bg-slate-200"></div>
      </div>
    </div>
  );
};

export const RankingSkeleton: React.FC = () => {
  return (
    <div className="space-y-3 animate-pulse">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 w-1/4">
            <div className="h-8 w-8 rounded-full bg-slate-200"></div>
            <div className="space-y-1.5 flex-1">
              <div className="h-4 w-28 rounded bg-slate-200"></div>
              <div className="h-3 w-20 rounded bg-slate-100"></div>
            </div>
          </div>
          <div className="h-6 w-16 rounded-full bg-slate-200"></div>
          <div className="h-6 w-16 rounded-full bg-slate-200"></div>
          <div className="h-6 w-20 rounded-full bg-slate-200"></div>
        </div>
      ))}
    </div>
  );
};

export const DetailSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse p-6 bg-white rounded-2xl border border-slate-200">
      <div className="h-8 w-1/2 rounded-md bg-slate-200"></div>
      <div className="h-4 w-1/4 rounded-md bg-slate-100"></div>
      <div className="space-y-2 py-4">
        <div className="h-4 w-full rounded bg-slate-100"></div>
        <div className="h-4 w-full rounded bg-slate-100"></div>
        <div className="h-4 w-3/4 rounded bg-slate-100"></div>
      </div>
    </div>
  );
};
