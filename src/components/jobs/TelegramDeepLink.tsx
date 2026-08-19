'use client';

import React, { useState } from 'react';
import { Application } from '@/types/application';
import { Check, Copy, ExternalLink, MessageSquare, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface TelegramDeepLinkProps {
  application: Application;
  onClose?: () => void;
}

export const TelegramDeepLink: React.FC<TelegramDeepLinkProps> = ({ application, onClose }) => {
  const [copied, setCopied] = useState(false);
  const telegramUrl =
    application.telegramLink ||
    `https://t.me/MatchSkillsBot?start=${application.id}_${application.jobId}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(telegramUrl);
    setCopied(true);
    toast.success('Link do Telegram copiado para a área de transferência!');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6 text-center py-2">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-[#1e3a5f]">
        <MessageSquare className="h-8 w-8 text-blue-600" />
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-bold text-slate-900">
          Candidatura enviada com sucesso! 🎉
        </h3>
        <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
          Sua candidatura para a vaga <span className="font-semibold text-slate-900">{application.jobTitle}</span> foi registrada. Agora complete a conversa com nosso Bot de IA no Telegram para avaliação de skills (BARS Method).
        </p>
      </div>

      {/* Telegram Link Box */}
      <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
          <span className="flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" /> Bot de Avaliação IA
          </span>
          <span>Código: {application.id}</span>
        </div>

        <div className="flex items-center gap-2 bg-white rounded-lg border border-slate-200 p-2">
          <input
            type="text"
            readOnly
            value={telegramUrl}
            className="w-full text-xs font-mono text-slate-700 bg-transparent outline-none truncate"
          />
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1 text-xs font-semibold text-[#1e3a5f] hover:text-blue-700 px-2.5 py-1 rounded-md hover:bg-slate-100 transition-colors shrink-0"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600" /> Copiado
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" /> Copiar
              </>
            )}
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
        <a
          href={telegramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-md hover:bg-blue-700 active:scale-95 transition-all"
        >
          Abrir no Telegram <ExternalLink className="h-4 w-4" />
        </a>
        {onClose && (
          <button
            onClick={onClose}
            className="w-full sm:w-auto rounded-xl border border-slate-200 py-3 px-5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Fechar
          </button>
        )}
      </div>
    </div>
  );
};
