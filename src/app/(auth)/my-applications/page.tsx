'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { applicationsService } from '@/services/applications.service';
import { Application } from '@/types/application';
import { formatDate } from '@/utils/helpers';
import {
  Building2,
  Calendar,
  ExternalLink,
  FileText,
  MessageSquare,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';

export default function MyApplicationsPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchApplications = async () => {
    if (!user?.id) {
      if (!isAuthLoading) {
        setIsLoading(false);
      }
      return;
    }
    setIsLoading(true);
    try {
      const data = await applicationsService.getMyApplications(user.id);
      setApplications(data);
    } catch {
      toast.error('Erro ao carregar candidaturas.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthLoading) {
      if (user?.id) {
        fetchApplications();
      } else {
        setIsLoading(false);
      }
    }
  }, [user?.id, isAuthLoading]);

  const isAppFinalized = (app: Application): boolean => {
    const hasSoftSkills =
      app.softskills !== null &&
      app.softskills !== undefined &&
      (typeof app.softskills === 'object'
        ? Object.keys(app.softskills).length > 0
        : Boolean(app.softskills));

    return app.status === 'completed' || hasSoftSkills;
  };

  const getStatusBadge = (app: Application) => {
    if (isAppFinalized(app)) {
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
          <Sparkles className="h-3.5 w-3.5 text-emerald-600" /> Conversa Finalizada
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
        <MessageSquare className="h-3.5 w-3.5 text-blue-600" /> Aguardando Telegram
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FileText className="h-6 w-6 text-[#1e3a5f]" /> Minhas Candidaturas
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Acompanhe o status das suas candidaturas e a realização da entrevista com o Bot IA no Telegram.
          </p>
        </div>

        <button
          onClick={fetchApplications}
          disabled={isLoading}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#1e3a5f] bg-blue-50 px-4 py-2.5 rounded-xl hover:bg-blue-100 transition-colors shrink-0 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} /> Atualizar Status
        </button>
      </div>

      {/* Applications Table / Cards */}
      {isLoading ? (
        <div className="bg-white rounded-2xl p-8 border border-slate-200 space-y-4 animate-pulse">
          <div className="h-6 w-1/4 rounded bg-slate-200"></div>
          <div className="h-12 w-full rounded bg-slate-100"></div>
          <div className="h-12 w-full rounded bg-slate-100"></div>
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
          <FileText className="h-10 w-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">Você ainda não possui candidaturas</h3>
          <p className="text-xs text-slate-500">Acesse a aba de vagas para se candidatar.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase tracking-wider">
                  <th className="py-4 px-6">Vaga / Empresa</th>
                  <th className="py-4 px-6">Data Envio</th>
                  <th className="py-4 px-6">Status IA</th>
                  <th className="py-4 px-6 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {applications.map((app) => {
                  const finalized = isAppFinalized(app);
                  return (
                    <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-6">
                        <p className="font-bold text-slate-900">{app.jobTitle}</p>
                        <p className="text-slate-500 flex items-center gap-1 mt-0.5">
                          <Building2 className="h-3 w-3" /> {app.companyName}
                        </p>
                      </td>

                      <td className="py-4 px-6 text-slate-600 font-medium whitespace-nowrap">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          {formatDate(app.createdAt)}
                        </span>
                      </td>

                      <td className="py-4 px-6 whitespace-nowrap">
                        {getStatusBadge(app)}
                      </td>

                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        {!finalized ? (
                          <a
                            href={app.telegramLink || `https://t.me/MatchSkillsBot?start=${app.id}_${app.jobId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 font-bold text-white bg-blue-600 hover:bg-blue-700 px-3.5 py-1.5 rounded-lg transition-colors shadow-sm cursor-pointer"
                          >
                            Telegram <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        ) : (
                          <span className="text-slate-400 font-medium text-xs">
                            Entrevista realizada
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
