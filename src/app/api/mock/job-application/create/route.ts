import { NextRequest, NextResponse } from 'next/server';
import { mockApplicationsStore, StoredJobApplication } from '../store';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { jobpostingId, candidateId, candidateName, hardskills } = body;

    if (!jobpostingId || !candidateId || !candidateName) {
      return NextResponse.json(
        { message: 'Parâmetros inválidos: jobpostingId, candidateId e candidateName são obrigatórios' },
        { status: 400 }
      );
    }

    const stringJobId = String(jobpostingId);
    const stringCandId = String(candidateId);

    // Verifica se já existe candidatura deste candidato para esta vaga
    const existing = mockApplicationsStore.find(
      (a) => a.jobpostingId === stringJobId && a.candidateId === stringCandId
    );

    if (existing) {
      return NextResponse.json(
        { message: 'Candidato já se aplicou a esta vaga', error: 'CONFLICT' },
        { status: 409 }
      );
    }

    const newId = String(mockApplicationsStore.length + 1);
    const now = new Date().toISOString();

    const newApplication: StoredJobApplication = {
      id: newId,
      jobpostingId: stringJobId,
      candidateId: stringCandId,
      candidateName,
      candidateEmail: body.candidateEmail,
      jobTitle: body.jobTitle || 'Vaga em Tecnologia',
      companyName: body.companyName || 'Empresa Parceira',
      hardskills: hardskills || [],
      status: 'pending',
      matchSoftSkillsPercent: 85,
      matchHardSkillsPercent: 80,
      createAt: now,
      createdAt: now,
    };

    mockApplicationsStore.unshift(newApplication);

    return NextResponse.json(
      {
        id: Number(newId) || newId,
        jobpostingId: Number(jobpostingId) || jobpostingId,
        candidateId: Number(candidateId) || candidateId,
        candidateName,
        hardskills: newApplication.hardskills,
        createAt: now,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Erro ao criar candidatura', error: String(error) },
      { status: 400 }
    );
  }
}
