import { NextRequest, NextResponse } from 'next/server';
import { mockApplicationsStore } from '../../store';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const stringJobId = String(id);

  const applications = mockApplicationsStore.filter((a) => a.jobpostingId === stringJobId);

  // Conforme jobapplication.MD: GET /job-application/jobposting/{id} retorna lista com match percents
  const responseList = applications.map((app) => ({
    applicationId: app.id,
    candidateId: app.candidateId,
    candidateName: app.candidateName,
    matchSoftSkillsPercent: app.matchSoftSkillsPercent ?? app.softSkillScore ?? 80,
    matchHardSkillsPercent: app.matchHardSkillsPercent ?? app.hardSkillScore ?? 80,
    curriculumUrl: app.curriculumUrl || `/api/mock/curriculum/${app.id}`,
    status: app.status,
    createAt: app.createAt,
  }));

  return NextResponse.json(responseList);
}
