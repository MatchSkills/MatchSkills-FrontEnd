import { NextRequest, NextResponse } from 'next/server';
import { mockApplicationsStore } from '../store';

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, softskills } = body;

    const stringId = String(id);
    const app = mockApplicationsStore.find((a) => a.id === stringId);

    if (!app) {
      return NextResponse.json({ message: 'Candidatura não encontrada' }, { status: 404 });
    }

    app.softskills = softskills;
    app.status = 'completed';

    return NextResponse.json({
      id: Number(app.id) || app.id,
      jobpostingId: Number(app.jobpostingId) || app.jobpostingId,
      candidateId: Number(app.candidateId) || app.candidateId,
      candidateName: app.candidateName,
      hardskills: app.hardskills,
      softskills: app.softskills,
      createAt: app.createAt,
    });
  } catch (error) {
    return NextResponse.json(
      { message: 'Erro ao atualizar softskills', error: String(error) },
      { status: 400 }
    );
  }
}
