import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CALENDAR_EVENTS, NEWSLETTERS } from '../data/mockData';
import { getCalendarDays, formatDate, isSameDay } from '../utils/helpers';
import './CalendarPage.css';

export default function CalendarPage() {
  const { state, dispatch, showToast } = useApp();
  const { announcements, isAdmin, settings } = state;
  const today = new Date();
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [newNotice, setNewNotice] = useState({ title: '', content: '', type: 'general' });
  const [showForm, setShowForm] = useState(false);

  const calDays = getCalendarDays(calYear, calMonth);
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  const monthLabel = `${calYear}년 ${calMonth + 1}월`;

  const prevMonth = () => { if (calMonth === 0) { setCalYear(calYear - 1); setCalMonth(11); } else setCalMonth(calMonth - 1); };
  const nextMonth = () => { if (calMonth === 11) { setCalYear(calYear + 1); setCalMonth(0); } else setCalMonth(calMonth + 1); };

  const getEventsForDate = (date) => {
    const iso = formatDate(date, 'iso');
    return CALENDAR_EVENTS.filter(e => e.date === iso);
  };

  const handleAddNotice = () => {
    if (!newNotice.title.trim()) return;
    dispatch({
      type: 'ADD_ANNOUNCEMENT',
      payload: { id: Date.now(), ...newNotice, date: formatDate(new Date(), 'iso') }
    });
    setNewNotice({ title: '', content: '', type: 'general' });
    setShowForm(false);
    showToast('공지사항이 등록되었습니다', 'success');
  };

  const handleCollect = (id) => {
    dispatch({ type: 'COLLECT_NEWSLETTER', payload: id });
    showToast('회수 1건 처리되었습니다', 'success');
  };

  return (
    <div className="calendar-page">
      {/* Google Calendar Embed */}
      {settings?.calendarId ? (
        <div className="card google-calendar-embed" style={{marginBottom: '1.5rem', overflow: 'hidden'}}>
          <iframe 
            src={`https://calendar.google.com/calendar/embed?src=${encodeURIComponent(settings.calendarId)}&ctz=Asia%2FSeoul&showPrint=0&showCalendars=0&showTz=0`} 
            style={{border: 0, width: '100%', height: '600px'}} 
            frameBorder="0" 
            scrolling="no"
            title="Google Calendar"
          ></iframe>
        </div>
      ) : (
        <div className="card google-calendar-embed" style={{marginBottom: '1.5rem', padding: '3rem', textAlign: 'center'}}>
          <h3>📅 구글 캘린더가 연동되지 않았습니다.</h3>
          {isAdmin ? (
            <p style={{color: 'var(--text-secondary)', marginTop: '0.5rem'}}>우측 상단의 ⚙️ 설정 메뉴에서 구글 캘린더 ID를 입력해주세요.</p>
          ) : (
            <p style={{color: 'var(--text-secondary)', marginTop: '0.5rem'}}>관리자가 캘린더를 연동하면 이 곳에 표시됩니다.</p>
          )}
        </div>
      )}

      <div className="calendar-page-grid">
        {/* Calendar */}
        <div className="full-calendar card">
          <div className="cal-nav">
            <button className="cal-nav-btn" onClick={prevMonth}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <span className="cal-month-year">{monthLabel}</span>
            <button className="cal-nav-btn" onClick={nextMonth}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </div>
          <div className="cal-grid">
            {weekdays.map((d, i) => <div key={d} className={`cal-weekday ${i === 0 ? 'sunday' : i === 6 ? 'saturday' : ''}`}>{d}</div>)}
            {calDays.map((d, i) => {
              const events = getEventsForDate(d.date);
              const isToday = isSameDay(d.date, today);
              return (
                <div key={i} className={`cal-day ${!d.currentMonth ? 'other-month' : ''} ${isToday ? 'today' : ''} ${events.length > 0 ? 'has-event' : ''}`}>
                  <span className={`cal-day-num ${isToday ? 'today-num' : ''}`}>{d.day}</span>
                  {events.map((ev, j) => (
                    <span key={j} className={`cal-event ${ev.type}`}>{ev.title}</span>
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar: Notices + Newsletter + Supplies */}
        <div className="calendar-sidebar">
          {/* Notice Board */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title"><span>📢</span> 공지사항</h3>
              {isAdmin && <button className="btn btn-sm btn-primary" onClick={() => setShowForm(!showForm)}>+ 새 공지</button>}
            </div>
            {isAdmin && showForm && (
              <div className="notice-form">
                <input className="form-input" placeholder="제목" value={newNotice.title} onChange={e => setNewNotice({...newNotice, title: e.target.value})} style={{marginBottom:'0.5rem'}} />
                <textarea className="form-input" placeholder="내용" value={newNotice.content} onChange={e => setNewNotice({...newNotice, content: e.target.value})} rows="3" style={{marginBottom:'0.5rem',resize:'vertical'}} />
                <div style={{display:'flex',gap:'0.5rem'}}>
                  <select className="form-input" value={newNotice.type} onChange={e => setNewNotice({...newNotice, type: e.target.value})} style={{flex:1}}>
                    <option value="general">일반</option>
                    <option value="important">중요</option>
                    <option value="newsletter">통신문</option>
                  </select>
                  <button className="btn btn-primary" onClick={handleAddNotice}>등록</button>
                </div>
              </div>
            )}
            <div className="notices-list">
              {announcements.slice(0, 5).map(n => (
                <div key={n.id} className="notice-card">
                  <div className="notice-card-header">
                    <span className={`notice-type ${n.type}`}>{n.type === 'important' ? '중요' : n.type === 'newsletter' ? '통신문' : '일반'}</span>
                    <span className="notice-card-date">{n.date}</span>
                  </div>
                  <div className="notice-card-title">{n.title}</div>
                  <div className="notice-card-content">{n.content}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Newsletter Manager */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title"><span>📄</span> 가정통신문 회수</h3>
            </div>
            <div className="newsletter-list">
              {NEWSLETTERS.map(n => {
                const stateN = state.newsletters.find(sn => sn.id === n.id) || n;
                const pct = Math.round((stateN.collected / stateN.distributed) * 100);
                return (
                  <div key={n.id} className="newsletter-item">
                    <span className="newsletter-icon">📋</span>
                    <div className="newsletter-info">
                      <div className="newsletter-name">{n.name}</div>
                      <div className="newsletter-status">배부: {stateN.distributed}장 · 회수: {stateN.collected}장</div>
                    </div>
                    <div className="newsletter-progress">
                      <div className="newsletter-ratio" style={{color: pct >= 90 ? 'var(--accent)' : pct >= 70 ? 'var(--secondary)' : 'var(--danger)'}}>{pct}%</div>
                      {isAdmin && (
                        <button className="btn btn-sm btn-outline" onClick={() => handleCollect(n.id)} style={{marginTop:'0.25rem',fontSize:'0.6875rem',padding:'2px 8px',minHeight:'24px'}}>+1 회수</button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
