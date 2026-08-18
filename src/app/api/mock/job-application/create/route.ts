import { NextRequest, NextResponse } from 'next/server';
import { mockApplicationsStore, StoredJobApplication } from '../store';

export async function POST(request: NextRequest) {
  try {
    let curriculumFile: File | null = null;
    let data: {
      jobpostingId?: number | string;
      candidateId?: number | string;
      candidateName?: string;
      hardskills?: string[];
      candidateEmail?: string;
      jobTitle?: string;
      companyName?: string;
    } = {};

    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const fileEntry = formData.get('curriculum');
      if (fileEntry && typeof fileEntry === 'object' && 'name' in fileEntry) {
        curriculumFile = fileEntry as File;
      }

      const dataEntry = formData.get('data');
      if (dataEntry) {
        if (typeof dataEntry === 'string') {
          try {
            data = JSON.parse(dataEntry);
          } catch {
            return NextResponse.json(
              { message: 'Parâmetros inválidos: campo data com JSON malformado' },
              { status: 400 }
            );
          }
        } else if (typeof dataEntry === 'object' && 'text' in dataEntry) {
          const text = await (dataEntry as Blob).text();
          try {
            data = JSON.parse(text);
          } catch {
            return NextResponse.json(
              { message: 'Parâmetros inválidos: campo data com JSON malformado' },
              { status: 400 }
            );
          }
        }
      }
    } else {
      // Fallback para requisições em JSON
      data = await request.json();
    }

    const { jobpostingId, candidateId, candidateName, hardskills } = data;

    if (!jobpostingId || !candidateId || !candidateName) {
      return NextResponse.json(
        {
          message:
            'Parâmetros inválidos: jobpostingId, candidateId e candidateName são obrigatórios',
        },
        { status: 400 }
      );
    }

    const stringJobId = String(jobpostingId);
    const stringCandId = String(candidateId);

    // Verifica se já existe candidatura deste candidato para esta vaga (409 CONFLICT)
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
      candidateEmail: data.candidateEmail,
      jobTitle: data.jobTitle || 'Vaga em Tecnologia',
      companyName: data.companyName || 'Empresa Parceira',
      hardskills: Array.isArray(hardskills) ? hardskills : [],
      curriculumFileName: curriculumFile ? curriculumFile.name : 'curriculum.pdf',
      curriculumUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
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
        softskills: newApplication.softskills,
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
