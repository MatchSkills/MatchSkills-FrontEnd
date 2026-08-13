import { NextRequest, NextResponse } from 'next/server';
import { mockJobsStore } from '../../route';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ companyId: string }> }
) {
  const { companyId } = await params;
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '0', 10);
  const size = parseInt(searchParams.get('size') || '10', 10);

  const filtered = mockJobsStore.filter((j) => j.companyId === companyId);
  const totalElements = filtered.length;
  const totalPages = Math.ceil(totalElements / size) || 1;
  const startIndex = page * size;
  const paginatedContent = filtered.slice(startIndex, startIndex + size);

  return NextResponse.json({
    content: paginatedContent,
    totalElements,
    totalPages,
    page,
    size,
  });
}
