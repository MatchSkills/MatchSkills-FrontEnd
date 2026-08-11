'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useCandidature } from '@/hooks/useCandidature';
import { Job } from '@/types/job';
import { TelegramDeepLink } from './TelegramDeepLink';
import { FileCheck, FileText, UploadCloud, User, X } from 'lucide-react';
import { toast } from 'sonner';

interface ApplicationModalProps {
  job: Job;
  onClose: () => void;
}

export const ApplicationModal: React.FC<ApplicationModalProps> = ({ job, onClose }) => {
  const { user } = useAuth();
  const { apply, isSubmitting, currentApplication } = useCandidature();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [step, setStep] = useState<1 | 2>(1);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== 'application/pdf') {
        toast.error('O arquivo deve ser exclusivamente no formato PDF.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('O tamanho do arquivo excede o limite de 5MB.');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error('Selecione seu currículo em PDF para prosseguir.');
      return;
    }

    const app = await apply({
      jobId: job.id,
      candidateId: user?.id || 'cand_default',
      candidateName: user?.name || 'Candidato Exemplo',
      candidateEmail: user?.email || 'candidato@example.com',
      jobTitle: job.title,
      companyName: job.companyName,
      curriculumFile: selectedFile,
    });

    if (app) {
      setStep(2);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
              Passo {step} de 2
            </span>
            <h3 className="text-lg font-bold text-slate-900 leading-tight">
              {step === 1 ? `Candidatar-se: ${job.title}` : 'Confirmação & Próximos Passos'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {step === 1 ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Candidate Info Summary */}
            <div className="rounded-xl bg-slate-50 p-4 border border-slate-200/80 space-y-2">
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                <User className="h-3.5 w-3.5 text-slate-400" /> Dados do Candidato
              </span>
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-800">{user?.name || 'Candidato'}</span>
                <span className="text-slate-500">{user?.email || 'email@exemplo.com'}</span>
              </div>
            </div>

            {/* PDF File Upload Zone */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700">
                Upload de Currículo (Formato PDF, Máx. 5MB)
              </label>
              <div className="relative border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-[#1e3a5f] transition-all bg-slate-50/50">
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {selectedFile ? (
                  <div className="flex items-center justify-center gap-2 text-emerald-600 font-semibold text-xs">
                    <FileCheck className="h-6 w-6" />
                    <span>{selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <UploadCloud className="h-8 w-8 text-slate-400 mx-auto" />
                    <p className="text-xs text-slate-600 font-medium">
                      <span className="text-[#1e3a5f] font-bold">Clique para selecionar</span> ou arraste seu PDF aqui
                    </p>
                    <p className="text-[10px] text-slate-400">Apenas arquivos .pdf de até 5MB</p>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !selectedFile}
                className="px-6 py-2.5 rounded-xl bg-[#1e3a5f] text-xs font-bold text-white shadow-md hover:bg-[#162b46] active:scale-95 transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Enviando...' : 'Enviar Currículo'}
              </button>
            </div>
          </form>
        ) : (
          currentApplication && (
            <TelegramDeepLink application={currentApplication} onClose={onClose} />
          )
        )}
      </div>
    </div>
  );
};
