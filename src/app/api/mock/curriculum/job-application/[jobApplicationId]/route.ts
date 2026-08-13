import { NextRequest, NextResponse } from 'next/server';
import { mockApplicationsStore } from '../../../job-application/store';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ jobApplicationId: string }> }
) {
  const { jobApplicationId } = await params;
  const stringId = String(jobApplicationId);

  const app = mockApplicationsStore.find((a) => a.id === stringId);

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { message: 'Arquivo não informado no multipart/form-data' },
        { status: 400 }
      );
    }

    if (app) {
      app.curriculumFileName = file.name;
      app.curriculumUrl = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
    }

    return NextResponse.json(
      {
        message: 'Currículo enviado com sucesso',
        jobApplicationId: stringId,
        fileName: file.name,
        fileSize: file.size,
        uploadedAt: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Erro ao processar upload do currículo', error: String(error) },
      { status: 400 }
    );
  }
}
