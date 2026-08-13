import { Application } from '@/types/application';

export interface StoredJobApplication {
  id: string;
  jobpostingId: string;
  candidateId: string;
  candidateName: string;
  candidateEmail?: string;
  jobTitle?: string;
  companyName?: string;
  hardskills: string[];
  softskills?: Record<string, number>;
  curriculumFileName?: string;
  curriculumUrl?: string;
  status: 'pending' | 'evaluating' | 'completed';
  softSkillScore?: number;
  hardSkillScore?: number;
  averageScore?: number;
  matchSoftSkillsPercent?: number;
  matchHardSkillsPercent?: number;
  createAt: string;
  createdAt: string;
}

export let mockApplicationsStore: StoredJobApplication[] = [
  {
    id: '1',
    jobpostingId: 'job_1',
    candidateId: 'cand_1',
    candidateName: 'Lucas Silva',
    candidateEmail: 'lucas.silva@example.com',
    jobTitle: 'Desenvolvedor Frontend Senior (Next.js)',
    companyName: 'TechCorp Solutions',
    hardskills: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
    softskills: { Comunicação: 5, Liderança: 4 },
    curriculumFileName: 'curriculum_lucas.pdf',
    curriculumUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    status: 'completed',
    softSkillScore: 92,
    hardSkillScore: 88,
    averageScore: 90,
    matchSoftSkillsPercent: 92,
    matchHardSkillsPercent: 88,
    createAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: '2',
    jobpostingId: 'job_1',
    candidateId: 'cand_2',
    candidateName: 'Mariana Costa',
    candidateEmail: 'mariana.costa@example.com',
    jobTitle: 'Desenvolvedor Frontend Senior (Next.js)',
    companyName: 'TechCorp Solutions',
    hardskills: ['React', 'TypeScript', 'Tailwind CSS', 'Axios'],
    softskills: { Comunicação: 4, Liderança: 4 },
    curriculumFileName: 'curriculum_mariana.pdf',
    curriculumUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    status: 'completed',
    softSkillScore: 78,
    hardSkillScore: 95,
    averageScore: 86.5,
    matchSoftSkillsPercent: 78,
    matchHardSkillsPercent: 95,
    createAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: '3',
    jobpostingId: 'job_1',
    candidateId: 'cand_3',
    candidateName: 'Carlos Eduardo',
    candidateEmail: 'carlos.edu@example.com',
    jobTitle: 'Desenvolvedor Frontend Senior (Next.js)',
    companyName: 'TechCorp Solutions',
    hardskills: ['Next.js', 'React'],
    softskills: { Comunicação: 3 },
    curriculumFileName: 'curriculum_carlos.pdf',
    curriculumUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    status: 'evaluating',
    softSkillScore: 65,
    hardSkillScore: 58,
    averageScore: 61.5,
    matchSoftSkillsPercent: 65,
    matchHardSkillsPercent: 58,
    createAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
];
