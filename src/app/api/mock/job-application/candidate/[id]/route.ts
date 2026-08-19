import { NextRequest, NextResponse } from 'next/server';
import { mockApplicationsStore } from '../../store';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const stringCandidateId = String(id);

  const applications = mockApplicationsStore.filter(
    (a) => a.candidateId === stringCandidateId || stringCandidateId === 'all'
  );

  return NextResponse.json(applications);
}
