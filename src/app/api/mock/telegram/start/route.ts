import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { applicationId } = body;

    const telegramLink = `https://t.me/MatchSkillsEvaluationBot?start=${applicationId || 'demo'}`;

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
