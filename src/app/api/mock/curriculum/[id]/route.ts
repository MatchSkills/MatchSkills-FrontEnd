import { NextRequest, NextResponse } from 'next/server';
import { mockApplicationsStore } from '../../job-application/store';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const stringId = String(id);

  const app = mockApplicationsStore.find((a) => a.id === stringId);

  // Exemplo de Signed URL para preview/download do currículo
  const signedUrl = app?.curriculumUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';

  // Retorna texto puro ou objeto compatível conforme curriculum.MD (String //signed url)
  return new NextResponse(signedUrl, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const stringId = String(id);

  const app = mockApplicationsStore.find((a) => a.id === stringId);
  if (app) {
    app.curriculumUrl = undefined;
    app.curriculumFileName = undefined;
  }

  return new NextResponse(null, { status: 204 });
}
