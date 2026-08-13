import { NextRequest, NextResponse } from 'next/server';
import { mockJobsStore } from '../route';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const job = mockJobsStore.find((j) => j.id === id);

  if (!job) {
    return NextResponse.json({ message: 'Vaga não encontrada' }, { status: 404 });
  }

  return NextResponse.json(job);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const index = mockJobsStore.findIndex((j) => j.id === id);

  if (index === -1) {
    return NextResponse.json({ message: 'Vaga não encontrada' }, { status: 404 });
  }

  try {
    const body = await request.json();
    mockJobsStore[index] = {
      ...mockJobsStore[index],
      ...body,
    };
    return NextResponse.json(mockJobsStore[index]);
  } catch (error) {
    return NextResponse.json(
      { message: 'Erro ao atualizar vaga', error: String(error) },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const index = mockJobsStore.findIndex((j) => j.id === id);

  if (index === -1) {
    return NextResponse.json({ message: 'Vaga não encontrada' }, { status: 404 });
  }

  mockJobsStore.splice(index, 1);
  return NextResponse.json({ message: 'Vaga removida com sucesso' });
}
