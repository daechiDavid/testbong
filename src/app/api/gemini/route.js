/* eslint-disable no-undef */
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { studentData } = await req.json();
    
    // 서버 환경 변수에서 API 키 조회
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: '서버에 Gemini API 키가 설정되지 않았습니다.' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    // 사용자가 지정한 최신 gemini-3.5-flash 모델을 설정하여 인스턴스를 생성합니다.
    const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' });

    const prompt = `
당신은 초등학교 교사입니다. 다음 학생의 기록을 바탕으로 생활기록부용 행동발달 종합의견을 작성해주세요.

[학생 정보]
이름: ${studentData.name}
성별: ${studentData.gender === 'M' ? '남' : '여'}
포인트: ${studentData.points}점

[관찰/상담 기록]
${studentData.records?.map(r => `- [${r.date}] [${r.category}] ${r.content}`).join('\n') || '기록 없음'}

[과제/수행평가 결과]
${studentData.evaluations?.map(e => `- [${e.title}] ${e.grade || '제출'}`).join('\n') || '기록 없음'}

[요청 사항]
1. 이 학생의 학교생활, 교우관계, 학업태도를 종합적으로 요약해주세요.
2. 장점을 부각하되, 발전할 점도 부드럽게 포함해주세요.
3. 생활기록부에 들어갈 만한 정중한 교사 어투(~함, ~임 형태)로 300자 내외로 작성해 주세요.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ summary: text });
  } catch (error) {
    console.error('Gemini API Error:', error);
    return NextResponse.json({ error: 'AI 종합의견 생성 중 오류가 발생했습니다.', details: error.message, stack: error.stack }, { status: 500 });
  }
}
