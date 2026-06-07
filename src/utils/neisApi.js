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
      // DDISH_NM 필드에 급식 메뉴가 들어있으며, '<br/>'로 줄바꿈 처리되어 있음
      const menuText = mealInfo.DDISH_NM;
      
      // 알레르기 정보(예: (1.2.3.)) 제거나 파싱을 할 수 있지만, 그대로 노출하거나 필터링 가능
      // 여기서는 정규식을 사용해 숫자 괄호를 제거하여 더 깔끔하게 보여줍니다.
      const cleanMenu = menuText.replace(/<br\/>/g, '\n').replace(/\([0-9.,]+\)/g, '').trim();
      
      return {
        date: mealInfo.MLSV_YMD, // YYYYMMDD
        type: mealInfo.MMEAL_SC_NM, // 조식, 중식, 석식
        menu: cleanMenu,
        calories: mealInfo.CAL_INFO // 칼로리 정보
      };
    } else {
      // 주말이거나 급식이 없는 경우
      return null;
    }
  } catch (error) {
    console.error('급식 정보를 가져오는 중 오류 발생:', error);
    return null;
  }
}
