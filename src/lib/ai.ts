import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Gemini API를 사용하여 학생 데이터를 기반으로 행동발달 종합의견을 생성합니다.
 */
export async function generateBehaviorSummary(studentData: any): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('서버에 Gemini API 키가 설정되지 않았습니다.');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  // 최신 gemini-3.5-flash 모델 설정
  const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' });

  // 안전한 타입 처리를 위해 옵셔널 체이닝 및 기본값 설정
  const recordsText = studentData.records?.map((r: any) => `- [${r.date}] [${r.category}] ${r.content}`).join('\n') || '기록 없음';
  const evaluationsText = studentData.evaluations?.map((e: any) => `- [${e.title}] ${e.grade || '제출'}`).join('\n') || '기록 없음';

  const prompt = `
당신은 초등학교 교사입니다. 다음 학생의 기록을 바탕으로 생활기록부용 행동발달 종합의견을 작성해주세요.

[학생 정보]
이름: ${studentData.name}
성별: ${studentData.gender === 'M' ? '남' : '여'}
포인트: ${studentData.points || 0}점

[관찰/상담 기록]
${recordsText}

[과제/수행평가 결과]
${evaluationsText}

[요청 사항]
1. 이 학생의 학교생활, 교우관계, 학업태도를 종합적으로 요약해주세요.
2. 장점을 부각하되, 발전할 점도 부드럽게 포함해주세요.
3. 생활기록부에 들어갈 만한 정중한 교사 어투(~함, ~임 형태)로 300자 내외로 작성해 주세요.
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}
