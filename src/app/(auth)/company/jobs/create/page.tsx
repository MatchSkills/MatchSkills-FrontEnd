'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useJobs } from '@/hooks/useJobs';
import {
  Briefcase,
  Code2,
  MapPin,
  Plus,
  PlusCircle,
  Sparkles,
  Star,
  Trash2,
  X,
} from 'lucide-react';
import { toast } from 'sonner';

export default function CreateJobPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { createJob } = useJobs(user?.id, { enabled: false });
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');

  // Hard skills tags
  const [hardSkills, setHardSkills] = useState<string[]>([
    'Next.js',
    'TypeScript',
    'Tailwind CSS',
  ]);
  const [newHardSkill, setNewHardSkill] = useState('');

  // Soft skills dict: skill name -> level 1 to 5
  const [softSkills, setSoftSkills] = useState<Record<string, number>>({
    Comunicação: 4,
    'Trabalho em Equipe': 4,
    'Resolução de Problemas': 5,
  });
  const [newSoftSkillName, setNewSoftSkillName] = useState('');
  const [newSoftSkillLevel, setNewSoftSkillLevel] = useState(4);

  const handleAddHardSkill = () => {
    if (!newHardSkill.trim()) return;
    if (!hardSkills.includes(newHardSkill.trim())) {
      setHardSkills([...hardSkills, newHardSkill.trim()]);
    }
    setNewHardSkill('');
  };

  const handleRemoveHardSkill = (skill: string) => {
    setHardSkills(hardSkills.filter((s) => s !== skill));
  };

  const handleAddSoftSkill = () => {
    if (!newSoftSkillName.trim()) return;
    setSoftSkills({
      ...softSkills,
      [newSoftSkillName.trim()]: newSoftSkillLevel,
    });
    setNewSoftSkillName('');
  };

  const handleRemoveSoftSkill = (skillName: string) => {
    const updated = { ...softSkills };
    delete updated[skillName];
    setSoftSkills(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !location.trim()) {
      toast.error('Preencha todos os campos obrigatórios.');
      return;
    }
    if (hardSkills.length === 0) {
      toast.error('Adicione pelo menos 1 Hard Skill.');
      return;
    }
    if (Object.keys(softSkills).length === 0) {
      toast.error('Adicione pelo menos 1 Soft Skill.');
      return;
    }
    if (!user?.id) {
      toast.error('Sessão da empresa não identificada. Por favor, faça login novamente.');
      return;
    }

    setIsSubmitting(true);
    try {
      await createJob({
        title,
        description,
        location,
        hardSkills,
        softSkills,
        companyId: String(user.id),
        companyName: user.name || 'Empresa',
      });
      router.push('/dashboard');
    } catch {
      // Erro exibido via toast no hook useJobs
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1e3a5f] bg-blue-50 px-3 py-1 rounded-full mb-2">
            <PlusCircle className="h-3.5 w-3.5" /> Nova Oportunidade
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Criar Nova Vaga</h1>
          <p className="text-xs text-slate-500 mt-1">
            Cadastre os requisitos técnicos e comportamentais (BARS) para iniciar a triagem por IA.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Título da Vaga *
              </label>
              <input
                type="text"
                placeholder="Ex: Desenvolvedor Frontend Senior (Next.js)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium outline-none focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/10"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Local de Trabalho / Modelo *
              </label>
              <input
                type="text"
                placeholder="Ex: São Paulo, SP (Híbrido) ou Remoto"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium outline-none focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/10"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Descrição Detalhada da Vaga *
              </label>
              <textarea
                rows={4}
                placeholder="Descreva as responsabilidades da vaga, objetivos do time e cultura..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium outline-none focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/10"
              ></textarea>
            </div>
          </div>

          {/* Hard Skills Section */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-900 flex items-center gap-2">
              <Code2 className="h-4 w-4 text-blue-600" /> Hard Skills Requeridas (Tags)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Digite a skill e pressione Adicionar (ex: Docker, GraphQL)"
                value={newHardSkill}
                onChange={(e) => setNewHardSkill(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddHardSkill();
                  }
                }}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-2 text-xs font-medium outline-none focus:border-[#1e3a5f]"
              />
              <button
                type="button"
                onClick={handleAddHardSkill}
                className="rounded-xl bg-slate-800 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-900"
              >
                Adicionar
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {hardSkills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-800 text-xs font-semibold px-3 py-1.5 rounded-lg border border-blue-200"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveHardSkill(skill)}
                    className="text-blue-500 hover:text-blue-800"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Soft Skills & Levels Section */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-500" /> Soft Skills & Nível Alvo (1 a 5)
            </label>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="Nome da Soft Skill (ex: Liderança, Comunicação)"
                value={newSoftSkillName}
                onChange={(e) => setNewSoftSkillName(e.target.value)}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-2 text-xs font-medium outline-none focus:border-[#1e3a5f]"
              />
              <select
                value={newSoftSkillLevel}
                onChange={(e) => setNewSoftSkillLevel(Number(e.target.value))}
                className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold outline-none focus:border-[#1e3a5f]"
              >
                <option value={1}>Nível 1</option>
                <option value={2}>Nível 2</option>
                <option value={3}>Nível 3</option>
                <option value={4}>Nível 4</option>
                <option value={5}>Nível 5</option>
              </select>
              <button
                type="button"
                onClick={handleAddSoftSkill}
                className="rounded-xl bg-amber-600 px-4 py-2 text-xs font-semibold text-white hover:bg-amber-700"
              >
                Adicionar
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {Object.entries(softSkills).map(([skillName, level]) => (
                <div
                  key={skillName}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200"
                >
                  <span className="text-xs font-bold text-slate-800">{skillName}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> {level}/5
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSoftSkill(skillName)}
                      className="text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="px-5 py-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isAuthLoading}
              className="px-7 py-3 rounded-xl bg-[#1e3a5f] text-xs font-bold text-white shadow-md hover:bg-[#162b46] active:scale-95 transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Criando Vaga...' : 'Criar Vaga'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

