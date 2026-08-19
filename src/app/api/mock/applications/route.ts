import { NextRequest, NextResponse } from 'next/server';
import { Application } from '@/types/application';

// In-memory mock store
let mockApplications: Application[] = [
  {
    id: 'app_1',
    candidateId: 'cand_1',
    candidateName: 'Lucas Silva',
    candidateEmail: 'lucas.silva@example.com',
    jobId: 'job_1',
    jobTitle: 'Desenvolvedor Frontend Senior (Next.js)',
    companyName: 'TechCorp Solutions',
    curriculumUrl: 'curriculum_lucas.pdf',
    status: 'completed',
    telegramLink: 'https://t.me/MatchSkillsEvaluationBot?start=app_1_job_1',
    softSkillScore: 92,
    hardSkillScore: 88,
    averageScore: 90,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'app_2',
    candidateId: 'cand_2',
    candidateName: 'Mariana Costa',
    candidateEmail: 'mariana.costa@example.com',
    jobId: 'job_1',
    jobTitle: 'Desenvolvedor Frontend Senior (Next.js)',
    companyName: 'TechCorp Solutions',
    curriculumUrl: 'curriculum_mariana.pdf',
    status: 'completed',
    telegramLink: 'https://t.me/MatchSkillsEvaluationBot?start=app_2_job_1',
    softSkillScore: 78,
    hardSkillScore: 95,
    averageScore: 86.5,
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'app_3',
    candidateId: 'cand_3',
    candidateName: 'Carlos Eduardo',
    candidateEmail: 'carlos.edu@example.com',
    jobId: 'job_1',
    jobTitle: 'Desenvolvedor Frontend Senior (Next.js)',
    companyName: 'TechCorp Solutions',
    curriculumUrl: 'curriculum_carlos.pdf',
    status: 'evaluating',
    telegramLink: 'https://t.me/MatchSkillsEvaluationBot?start=app_3_job_1',
    softSkillScore: 65,
    hardSkillScore: 58,
    averageScore: 61.5,
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const candidateId = searchParams.get('candidateId');
  const applicationId = searchParams.get('applicationId');
  const jobId = searchParams.get('jobId');

  if (applicationId) {
    const app = mockApplications.find((a) => a.id === applicationId);
    if (!app) {
      return NextResponse.json({ message: 'Candidatura não encontrada' }, { status: 404 });
    }
    return NextResponse.json(app);
  }

  let filtered = [...mockApplications];
  if (candidateId) {
    filtered = filtered.filter((a) => a.candidateId === candidateId);
  }
  if (jobId) {
    filtered = filtered.filter((a) => a.jobId === jobId);
  }

  return NextResponse.json(filtered);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { candidateId, jobId, candidateName, candidateEmail, jobTitle, companyName } = body;

    const newAppId = `app_${Date.now()}`;
    const newJobId = jobId || 'job_1';
    const telegramLink = `https://t.me/MatchSkillsEvaluationBot?start=${newAppId}_${newJobId}`;

    const newApplication: Application = {
      id: newAppId,
      candidateId: candidateId || 'cand_default',
      candidateName: candidateName || 'Candidato Exemplo',
      candidateEmail: candidateEmail || 'candidato@example.com',
      jobId: jobId || 'job_1',
      jobTitle: jobTitle || 'Vaga Desenvolvedor Tech',
      companyName: companyName || 'Empresa Parceira',
      curriculumUrl: body.curriculumUrl || 'curriculo.pdf',
      status: 'pending',
      telegramLink,
      createdAt: new Date().toISOString(),
    };

    mockApplications.unshift(newApplication);

    return NextResponse.json(newApplication, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Erro ao processar candidatura', error: String(error) },
      { status: 400 }
    );
  }
}
