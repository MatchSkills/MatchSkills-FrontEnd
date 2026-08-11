import { NextRequest, NextResponse } from 'next/server';
import { RankingApplicant, RankingResponse } from '@/types/ranking';

const mockApplicantsData: RankingApplicant[] = [
  {
    candidateId: 'cand_1',
    applicationId: 'app_1',
    name: 'Lucas Silva',
    email: 'lucas.silva@example.com',
    softSkillScore: 92,
    hardSkillScore: 88,
    averageScore: 90,
    status: 'completed',
    evaluatedAt: '2026-08-10T14:30:00Z',
  },
  {
    candidateId: 'cand_2',
    applicationId: 'app_2',
    name: 'Mariana Costa',
    email: 'mariana.costa@example.com',
    softSkillScore: 78,
    hardSkillScore: 95,
    averageScore: 86.5,
    status: 'completed',
    evaluatedAt: '2026-08-11T09:15:00Z',
  },
  {
    candidateId: 'cand_3',
    applicationId: 'app_3',
    name: 'Carlos Eduardo',
    email: 'carlos.edu@example.com',
    softSkillScore: 65,
    hardSkillScore: 58,
    averageScore: 61.5,
    status: 'evaluating',
    evaluatedAt: '2026-08-11T11:00:00Z',
  },
  {
    candidateId: 'cand_4',
    applicationId: 'app_4',
    name: 'Fernanda Oliveira',
    email: 'fernanda.oli@example.com',
    softSkillScore: 96,
    hardSkillScore: 91,
    averageScore: 93.5,
    status: 'completed',
    evaluatedAt: '2026-08-10T18:00:00Z',
  },
  {
    candidateId: 'cand_5',
    applicationId: 'app_5',
    name: 'Rafael Santos',
    email: 'rafael.santos@example.com',
    softSkillScore: 54,
    hardSkillScore: 72,
    averageScore: 63,
    status: 'completed',
    evaluatedAt: '2026-08-09T16:45:00Z',
  },
  {
    candidateId: 'cand_6',
    applicationId: 'app_6',
    name: 'Beatriz Lima',
    email: 'beatriz.lima@example.com',
    softSkillScore: 84,
    hardSkillScore: 86,
    averageScore: 85,
    status: 'completed',
    evaluatedAt: '2026-08-11T13:20:00Z',
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const jobId = searchParams.get('jobId') || 'job_1';
  const minScore = Number(searchParams.get('minScore') || 0);

  let applicants = [...mockApplicantsData];

  if (minScore > 0) {
    applicants = applicants.filter((app) => app.averageScore >= minScore);
  }

  const response: RankingResponse = {
    jobId,
    jobTitle: 'Desenvolvedor Frontend Senior (Next.js)',
    applicants,
    totalElements: applicants.length,
    totalPages: 1,
  };

  return NextResponse.json(response);
}
