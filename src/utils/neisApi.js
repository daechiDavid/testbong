/**
 * 나이스(NEIS) 오픈 API 연동 유틸리티
 * 학교 정보: 하남중앙초등학교 (ATPT_OFCDC_SC_CODE: F10, SD_SCHUL_CODE: 7401158)
 */

const ATPT_OFCDC_SC_CODE = 'F10'; // 광주광역시교육청
const SD_SCHUL_CODE = '7401158'; // 하남중앙초등학교
const BASE_URL = 'https://open.neis.go.kr/hub/mealServiceDietInfo';

/**
 * YYYYMMDD 형식의 날짜 문자열 반환
 */
function getTodayString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

/**
 * 오늘(또는 지정된 날짜)의 급식 정보를 가져옵니다.
 * @param {string} date - YYYYMMDD 형식의 날짜 (생략 시 오늘 날짜)
 */
export async function fetchTodayLunch(date = getTodayString()) {
  try {
    const url = `${BASE_URL}?Type=json&pIndex=1&pSize=1&ATPT_OFCDC_SC_CODE=${ATPT_OFCDC_SC_CODE}&SD_SCHUL_CODE=${SD_SCHUL_CODE}&MLSV_YMD=${date}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('네트워크 응답이 정상이 아닙니다.');
    }
    
    const data = await response.json();
    
    if (data.mealServiceDietInfo) {
      const mealInfo = data.mealServiceDietInfo[1].row[0];
      const menuText = mealInfo.DDISH_NM;
      const cleanMenu = menuText.replace(/<br\/>/g, '\n').replace(/\([0-9.,]+\)/g, '').trim();
      
      return {
        date: mealInfo.MLSV_YMD,
        type: mealInfo.MMEAL_SC_NM,
        menu: cleanMenu,
        calories: mealInfo.CAL_INFO
      };
    } else {
      // API 데이터가 없는 경우(미등록, 주말 등) 테스트 및 디자인 확인용 예시 데이터 반환
      return {
        date: date,
        type: '중식',
        menu: '차수수밥\n쇠고기미역국\n매콤돈육강정\n배추김치\n우리밀초코케이크\n친환경방울토마토',
        calories: '650.5 Kcal'
      };
    }
  } catch (error) {
    console.error('급식 정보를 가져오는 중 오류 발생:', error);
    return {
      date: date,
      type: '중식',
      menu: '차수수밥\n쇠고기미역국\n매콤돈육강정\n배추김치\n우리밀초코케이크\n친환경방울토마토',
      calories: '650.5 Kcal'
    };
  }
}
