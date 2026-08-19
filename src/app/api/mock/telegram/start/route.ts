import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { applicationId, jobId } = body;

    const telegramLink = `https://t.me/MatchSkillsBot?start=${applicationId || 'demo'}_${jobId || 'job_1'}`;

    return NextResponse.json({
      applicationId,
      telegramLink,
    });
  } catch (error) {
    return NextResponse.json(
      { message: 'Erro ao gerar link do Telegram', error: String(error) },
      { status: 400 }
    );
  }
}
