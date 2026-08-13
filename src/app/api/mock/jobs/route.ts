import { NextRequest, NextResponse } from 'next/server';
import { Job } from '@/types/job';

// In-memory mock store for jobs
export let mockJobsStore: Job[] = [
  {
    id: 'job_1',
    companyId: 'comp_1',
    companyName: 'TechCorp Solutions',
    title: 'Desenvolvedor Frontend Senior (Next.js)',
    description:
      'Procuramos desenvolvedor frontend sênior com vivência sólida em Next.js App Router, TypeScript e Tailwind CSS para integrar time de alta performance em plataforma SaaS.',
    location: 'São Paulo, SP (Híbrido)',
    hardSkills: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Axios'],
    softSkills: { Comunicação: 5, Liderança: 4, 'Resolução de Problemas': 5, Proatividade: 4 },
    status: 'active',
    salaryRange: 'R$ 12.000 - R$ 16.000',
    experienceLevel: 'Sênior',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 'job_2',
    companyId: 'comp_1',
    companyName: 'TechCorp Solutions',
    title: 'Engenheiro de IA & Machine Learning',
    description:
      'Vaga para atuar na criação de modelos BARS e agentes de IA para avaliação comportamental e mapeamento de perfis de profissionais tech.',
    location: 'Remoto',
    hardSkills: ['Python', 'PyTorch', 'LangChain', 'FastAPI', 'Docker'],
    softSkills: { 'Pensamento Crítico': 5, 'Trabalho em Equipe': 4, Autonomia: 5 },
    status: 'active',
    salaryRange: 'R$ 14.000 - R$ 18.000',
    experienceLevel: 'Sênior / Especialista',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'job_3',
    companyId: 'comp_2',
    companyName: 'Innovate Tech Labs',
    title: 'Desenvolvedor Fullstack Node.js / React',
    description:
      'Desenvolvimento de APIs RESTful e aplicações dinâmicas em microserviços Node.js e interfaces modernas em React.',
    location: 'Florianópolis, SC (Remoto)',
    hardSkills: ['Node.js', 'React', 'PostgreSQL', 'Docker', 'Jest'],
    softSkills: { Organização: 4, Flexibilidade: 4, Empatia: 4 },
    status: 'active',
    salaryRange: 'R$ 8.000 - R$ 11.000',
    experienceLevel: 'Pleno',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search')?.toLowerCase() || '';
  const page = parseInt(searchParams.get('page') || '0', 10);
  const size = parseInt(searchParams.get('size') || '10', 10);

  let filtered = [...mockJobsStore];

  if (search) {
    filtered = filtered.filter(
      (job) =>
        job.title.toLowerCase().includes(search) ||
        job.companyName.toLowerCase().includes(search) ||
        job.location.toLowerCase().includes(search) ||
        job.hardSkills.some((skill) => skill.toLowerCase().includes(search))
    );
  }

  const totalElements = filtered.length;
  const totalPages = Math.ceil(totalElements / size) || 1;
  const startIndex = page * size;
  const paginatedContent = filtered.slice(startIndex, startIndex + size);

  return NextResponse.json({
    content: paginatedContent,
    totalElements,
    totalPages,
    page,
    size,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const title = body.title;
    const description = body.description;
    const location = body.local || body.location;
    const hardSkills = body.targetHardskills || body.hardSkills || [];
    const softSkills = body.targetSoftskills || body.softSkills || {};

    if (!title || !description || !location) {
      return NextResponse.json(
        { message: 'Campos obrigatórios ausentes: title, description, local/location' },
        { status: 400 }
      );
    }

    const newJob: Job = {
      id: `job_${Date.now()}`,
      companyId: String(body.companyId || 'comp_1'),
      companyName: body.companyName || 'TechCorp Solutions',
      title,
      description,
      location,
      hardSkills,
      softSkills,
      status: body.status || 'active',
      salaryRange: body.salaryRange || 'A combinar',
      experienceLevel: body.experienceLevel || 'Pleno/Sênior',
      createdAt: new Date().toISOString(),
      local: location,
      createAt: new Date().toISOString(),
      targetHardskills: hardSkills,
      targetSoftskills: softSkills,
    };

    mockJobsStore.unshift(newJob);

    return NextResponse.json(newJob, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Erro ao criar vaga', error: String(error) },
      { status: 400 }
    );
  }
}
