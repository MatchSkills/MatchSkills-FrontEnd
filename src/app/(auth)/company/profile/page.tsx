'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { companiesService } from '@/services/companies.service';
import { Building2, Edit3, LogOut, Mail, MapPin, Save, ShieldCheck, User } from 'lucide-react';
import { toast } from 'sonner';

export default function CompanyProfilePage() {
  const { user, updateUser, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || 'TechCorp Solutions');
  const [email, setEmail] = useState(user?.email || 'contato@techcorp.com');
  const [address, setAddress] = useState(user?.address || 'Av. Paulista, 1000 - São Paulo, SP');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await companiesService.updateCompany(user?.id || 'comp_1', { name, email, address });
      updateUser({ name, email, address });
      setIsEditing(false);
      toast.success('Dados da empresa atualizados com sucesso!');
    } catch {
      toast.error('Erro ao atualizar empresa.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-[#1e3a5f]">
              <Building2 className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">{user?.name}</h1>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full mt-1">
                <ShieldCheck className="h-3.5 w-3.5" /> CNPJ Verificado
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1e3a5f] border border-slate-200 px-4 py-2 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <Edit3 className="h-4 w-4" /> {isEditing ? 'Cancelar' : 'Editar Perfil'}
          </button>
        </div>

        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nome da Empresa</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium outline-none focus:border-[#1e3a5f]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">E-mail Corporativo</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium outline-none focus:border-[#1e3a5f]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Endereço</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium outline-none focus:border-[#1e3a5f]"
              />
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#1e3a5f] py-3 text-sm font-bold text-white shadow-md hover:bg-[#162b46] transition-all"
            >
              <Save className="h-4 w-4" /> Salvar Alterações
            </button>
          </form>
        ) : (
          <div className="space-y-4 text-xs font-medium text-slate-700">
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <Building2 className="h-4 w-4 text-slate-400" />
              <div>
                <span className="block text-[10px] text-slate-400 uppercase font-bold">CNPJ</span>
                <span className="font-bold text-slate-900">{user?.cnpj || '12.345.678/0001-99'}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <Mail className="h-4 w-4 text-slate-400" />
              <div>
                <span className="block text-[10px] text-slate-400 uppercase font-bold">E-mail Corporativo</span>
                <span className="font-bold text-slate-900">{user?.email}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <MapPin className="h-4 w-4 text-slate-400" />
              <div>
                <span className="block text-[10px] text-slate-400 uppercase font-bold">Endereço</span>
                <span className="font-bold text-slate-900">{user?.address || 'Av. Paulista, 1000 - São Paulo, SP'}</span>
              </div>
            </div>
          </div>
        )}

        <div className="pt-6 border-t border-slate-100">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 py-3 text-xs font-bold text-rose-600 hover:bg-rose-100 transition-colors"
          >
            <LogOut className="h-4 w-4" /> Sair da Conta
          </button>
        </div>
      </div>
    </div>
  );
}
