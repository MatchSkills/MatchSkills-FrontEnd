'use client';

import React, { useState, useRef, useEffect } from 'react';
import { AVAILABLE_SOFT_SKILLS } from '@/constants/skills';
import { Search, ChevronDown, Check, Plus, Star } from 'lucide-react';

interface SoftSkillSelectProps {
  existingSkills: Record<string, number>;
  onAddSkill: (skillName: string, level: number) => void;
}

export const SoftSkillSelect: React.FC<SoftSkillSelectProps> = ({
  existingSkills,
  onAddSkill,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<number>(4);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  const filteredSkills = AVAILABLE_SOFT_SKILLS.filter((skill) =>
    skill
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .includes(
        searchQuery
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
      )
  );

  const handleSelectSkill = (skill: string) => {
    setSelectedSkill(skill);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleAdd = () => {
    if (!selectedSkill) return;
    onAddSkill(selectedSkill, selectedLevel);
    setSelectedSkill('');
    setSearchQuery('');
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-2.5">
        {/* Custom Searchable Select Dropdown */}
        <div className="relative flex-1" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className={`w-full flex items-center justify-between rounded-xl border bg-white px-4 py-2.5 text-xs font-medium text-left transition-all ${
              isOpen
                ? 'border-[#1e3a5f] ring-2 ring-[#1e3a5f]/10 shadow-sm'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <span className={selectedSkill ? 'text-slate-900 font-semibold' : 'text-slate-400'}>
              {selectedSkill || 'Selecione uma Soft Skill disponível...'}
            </span>
            <ChevronDown
              className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
                isOpen ? 'rotate-180 text-[#1e3a5f]' : ''
              }`}
            />
          </button>

          {isOpen && (
            <div className="absolute z-50 mt-1.5 w-full rounded-xl border border-slate-200 bg-white p-2 shadow-xl animate-in fade-in-50 zoom-in-95 duration-100">
              {/* Search input inside select */}
              <div className="relative mb-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Pesquisar soft skill..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (filteredSkills.length > 0) {
                        handleSelectSkill(filteredSkills[0]);
                      }
                    }
                  }}
                  className="w-full rounded-lg bg-slate-50 border border-slate-200 pl-8 pr-3 py-1.5 text-xs text-slate-800 outline-none placeholder:text-slate-400 focus:border-[#1e3a5f] focus:bg-white transition-colors"
                />
              </div>

              {/* List of skills */}
              <div className="max-h-56 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                {filteredSkills.length === 0 ? (
                  <div className="py-4 text-center text-xs text-slate-400">
                    Nenhuma soft skill encontrada para &quot;{searchQuery}&quot;
                  </div>
                ) : (
                  filteredSkills.map((skill) => {
                    const isAlreadyAdded = Boolean(existingSkills[skill]);
                    const isCurrentSelection = selectedSkill === skill;

                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => handleSelectSkill(skill)}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg text-left transition-colors ${
                          isCurrentSelection
                            ? 'bg-blue-50 text-[#1e3a5f] font-bold'
                            : 'hover:bg-slate-50 text-slate-700 font-medium'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          {isCurrentSelection && <Check className="h-3.5 w-3.5 text-[#1e3a5f]" />}
                          {skill}
                        </span>
                        {isAlreadyAdded && (
                          <span className="text-[10px] font-semibold bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-200/60">
                            Adicionada ({existingSkills[skill]}/5)
                          </span>
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* Level selector */}
        <div className="flex items-center gap-2">
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(Number(e.target.value))}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold text-slate-700 outline-none focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/10"
          >
            {[1, 2, 3, 4, 5].map((lvl) => (
              <option key={lvl} value={lvl}>
                Nível {lvl}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={handleAdd}
            disabled={!selectedSkill}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-amber-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-amber-700 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none"
          >
            <Plus className="h-4 w-4" />
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
};
