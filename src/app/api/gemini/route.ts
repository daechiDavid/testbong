import { NextResponse } from 'next/server';
import { generateBehaviorSummary } from '../../../lib/ai';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { studentData } = body;

    if (!studentData) {
      return NextResponse.json({ error: '학생 데이터가 제공되지 않았습니다.' }, { status: 400 });
    }

    const summary = await generateBehaviorSummary(studentData);

    return NextResponse.json({ summary });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return NextResponse.json(
      { error: 'AI 종합의견 생성 중 오류가 발생했습니다.', details: error.message },
      { status: 500 }
    );
  }
}
