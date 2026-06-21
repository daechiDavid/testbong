import { useApp } from '../context/AppContext';
import './CalendarPage.css';

export default function CalendarPage() {
  const { state } = useApp();
  const { isAdmin, settings } = state;

  const calendars = [settings?.calendarId1, settings?.calendarId2, settings?.calendarId3].filter(Boolean);

  const getCombinedCalendarSrc = (cals) => {
    if (cals.length === 0) return '';
    
    let baseUrl = 'https://calendar.google.com/calendar/embed?ctz=Asia%2FSeoul&showPrint=0&showCalendars=0&showTz=0&mode=MONTH';
    const colors = ['%23039BE5', '%23D50000', '%230B8043'];
    
    cals.forEach((input, index) => {
      const srcMatch = input.match(/src="([^"]+)"/);
      let extracted = srcMatch ? srcMatch[1] : input.trim();
      
      let calId = '';
      if (extracted.includes('calendar.google.com') && extracted.includes('src=')) {
         const match = extracted.match(/src=([^&]+)/);
         if (match) calId = decodeURIComponent(match[1]);
      } else {
         calId = extracted;
      }
      
      if (calId) {
          baseUrl += `&src=${encodeURIComponent(calId)}&color=${colors[index % colors.length]}`;
      }
    });
    
    return baseUrl;
  };

  return (
    <div className="calendar-page" style={{ height: '100%' }}>
      {calendars.length > 0 ? (
          <div className="card google-calendar-embed" style={{ height: '100%', padding: '0' }}>
            <iframe 
              src={getCombinedCalendarSrc(calendars)} 
              width="100%"
              height="800"
              frameBorder="0" 
              title="Google Calendar Combined"
              style={{ display: 'block', border: 'none' }}
            ></iframe>
          </div>
      ) : (
        <div className="card google-calendar-embed" style={{padding: '3rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '800px'}}>
          <h3>📅 구글 캘린더가 연동되지 않았습니다.</h3>
          {isAdmin ? (
            <p style={{color: 'var(--text-secondary)', marginTop: '0.5rem'}}>우측 상단의 ⚙️ 설정 메뉴에서 구글 캘린더 ID를 입력해주세요.</p>
          ) : (
            <p style={{color: 'var(--text-secondary)', marginTop: '0.5rem'}}>관리자가 캘린더를 연동하면 이 곳에 표시됩니다.</p>
          )}
        </div>
      )}
    </div>
  );
}
