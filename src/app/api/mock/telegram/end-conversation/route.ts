import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { applicationId } = body;

    const softSkillScore = Math.floor(Math.random() * 30) + 70; // 70-100
    const hardSkillScore = Math.floor(Math.random() * 35) + 65; // 65-100
    const averageScore = Math.round(((softSkillScore + hardSkillScore) / 2) * 10) / 10;

    return NextResponse.json({
      applicationId,
      status: 'completed',
      softSkillScore,
      hardSkillScore,
      averageScore,
      message: 'Avaliação concluída com sucesso via IA (Método BARS)!',
    });
  } catch (error) {
    return NextResponse.json(
      { message: 'Erro ao finalizar conversa mock do Telegram', error: String(error) },
      { status: 400 }
    );
  }
}
