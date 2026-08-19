'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { jobsService } from '@/services/jobs.service';
import { Job } from '@/types/job';
import { SoftSkillSelect } from '@/components/jobs/SoftSkillSelect';
import { Code2, Edit, Save, Sparkles, Star, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';

export default function EditJobPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [hardSkills, setHardSkills] = useState<string[]>([]);
  const [newHardSkill, setNewHardSkill] = useState('');
  const [softSkills, setSoftSkills] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!id) return;
    const loadJob = async () => {
      setIsLoading(true);
      try {
        const job = await jobsService.getJobById(id);
        setTitle(job.title);
        setDescription(job.description);
        setLocation(job.location);
        setHardSkills(job.hardSkills || []);
        setSoftSkills(job.softSkills || {});
      } catch {
        toast.error('Erro ao carregar dados da vaga.');
      } finally {
        setIsLoading(false);
      }
    };
    loadJob();
  }, [id]);

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

  const handleAddSoftSkill = (skillName: string, level: number) => {
    setSoftSkills((prev) => ({
      ...prev,
      [skillName]: level,
    }));
  };

  const handleRemoveSoftSkill = (skillName: string) => {
    const updated = { ...softSkills };
    delete updated[skillName];
    setSoftSkills(updated);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await jobsService.updateJob(id, {
        title,
        description,
        location,
        hardSkills,
        softSkills,
      });
      toast.success('Vaga atualizada com sucesso!');
      router.push('/dashboard');
    } catch {
      toast.error('Erro ao atualizar vaga.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      await jobsService.deleteJob(id);
      toast.success('Vaga excluída.');
      router.push('/dashboard');
    } catch {
      toast.error('Erro ao excluir vaga.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-slate-200 animate-pulse space-y-4">
        <div className="h-6 w-1/3 rounded bg-slate-200"></div>
        <div className="h-10 w-full rounded bg-slate-100"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#1e3a5f] bg-blue-50 px-3 py-1 rounded-full mb-2">
              <Edit className="h-3.5 w-3.5" /> Editar Oportunidade
            </span>
            <h1 className="text-2xl font-bold text-slate-900">Editar Vaga</h1>
          </div>

          <button
            type="button"
            onClick={() => setDeleteModalOpen(true)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 px-4 py-2 rounded-xl hover:bg-rose-100 transition-colors"
          >
            <Trash2 className="h-4 w-4" /> Excluir Vaga
          </button>
        </div>

        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Título da Vaga
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium outline-none focus:border-[#1e3a5f]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Local de Trabalho / Modelo
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium outline-none focus:border-[#1e3a5f]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Descrição da Vaga
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium outline-none focus:border-[#1e3a5f]"
              ></textarea>
            </div>
          </div>

          {/* Hard Skills Section */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-900 flex items-center gap-2">
              <Code2 className="h-4 w-4 text-blue-600" /> Hard Skills Requeridas
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Adicionar nova skill"
                value={newHardSkill}
                onChange={(e) => setNewHardSkill(e.target.value)}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-2 text-xs font-medium outline-none"
              />
              <button
                type="button"
                onClick={handleAddHardSkill}
                className="rounded-xl bg-slate-800 px-4 py-2 text-xs font-semibold text-white"
              >
                Adicionar
              </button>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {hardSkills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-800 text-xs font-semibold px-3 py-1 rounded-lg border border-blue-200"
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

          {/* Soft Skills Section */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <div>
              <label className="block text-xs font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-500" /> Soft Skills (Nível 1 a 5)
              </label>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Selecione as competências comportamentais requeridas e defina o nível alvo esperado.
              </p>
            </div>

            <SoftSkillSelect
              existingSkills={softSkills}
              onAddSkill={handleAddSoftSkill}
            />

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
              disabled={isSubmitting}
              className="px-7 py-3 rounded-xl bg-[#1e3a5f] text-xs font-bold text-white shadow-md hover:bg-[#162b46] transition-all disabled:opacity-50 inline-flex items-center gap-2"
            >
              <Save className="h-4 w-4" /> Salvar Alterações
            </button>
          </div>
        </form>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 text-center">
            <Trash2 className="h-10 w-10 text-rose-500 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900">Tem certeza?</h3>
            <p className="text-xs text-slate-600">
              Esta ação excluirá permanentemente a vaga e removerá o ranking de candidatos associados.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={isSubmitting}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 text-xs font-bold text-white hover:bg-rose-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Excluindo...' : 'Sim, Excluir'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
