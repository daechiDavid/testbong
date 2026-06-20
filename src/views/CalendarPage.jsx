import { useState } from 'react';
import { useApp } from '../context/AppContext';
import './CalendarPage.css';

export default function CalendarPage() {
  const { state, dispatch, showToast } = useApp();
  const { announcements, isAdmin, settings } = state;
  const [newNotice, setNewNotice] = useState({ title: '', content: '', type: 'general' });
  const [showForm, setShowForm] = useState(false);
  const [editNoticeId, setEditNoticeId] = useState(null);

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

  const handleAddNotice = () => {
    if (!newNotice.title.trim()) return;
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    if (editNoticeId) {
      dispatch({
        type: 'UPDATE_ANNOUNCEMENT',
        payload: { id: editNoticeId, ...newNotice, date: dateStr }
      });
      showToast('공지사항이 수정되었습니다', 'success');
    } else {
      dispatch({
        type: 'ADD_ANNOUNCEMENT',
        payload: { id: Date.now(), ...newNotice, date: dateStr }
      });
      showToast('공지사항이 등록되었습니다', 'success');
    }
    
    setNewNotice({ title: '', content: '', type: 'general' });
    setShowForm(false);
    setEditNoticeId(null);
  };

  const handleEditNotice = (n) => {
    setNewNotice({ title: n.title, content: n.content, type: n.type });
    setEditNoticeId(n.id);
    setShowForm(true);
  };

  const handleDeleteNotice = (id) => {
    if (confirm('이 공지사항을 삭제하시겠습니까?')) {
      dispatch({ type: 'DELETE_ANNOUNCEMENT', payload: id });
      showToast('공지사항이 삭제되었습니다', 'success');
    }
  };

  return (
    <div className="calendar-page">
      <div className="calendar-two-col">
        {/* Google Calendar Embed */}
        <div className="calendar-left" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {calendars.length > 0 ? (
              <div className="card google-calendar-embed" style={{overflow: 'hidden', flex: 1, height: '800px'}}>
                <iframe 
                  src={getCombinedCalendarSrc(calendars)} 
                  style={{border: 0, width: '100%', height: '100%', minHeight: '800px'}} 
                  frameBorder="0" 
                  scrolling="no"
                  title="Google Calendar Combined"
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

        {/* Notice Board */}
        <div className="calendar-right">
          <div className="card notice-card-container">
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
                  <button className="btn btn-primary" onClick={handleAddNotice}>{editNoticeId ? '수정' : '등록'}</button>
                  {editNoticeId && <button className="btn btn-secondary" onClick={() => {setShowForm(false); setEditNoticeId(null); setNewNotice({title:'', content:'', type:'general'})}}>취소</button>}
                </div>
              </div>
            )}
            <div className="notices-list">
              {announcements.length > 0 ? announcements.map(n => (
                <div key={n.id} className="notice-card">
                  <div className="notice-card-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className={`notice-type ${n.type}`}>{n.type === 'important' ? '중요' : n.type === 'newsletter' ? '통신문' : '일반'}</span>
                      <span className="notice-card-date">{n.date}</span>
                    </div>
                    {isAdmin && (
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button className="icon-btn" onClick={() => handleEditNotice(n)} style={{ fontSize: '0.75rem', padding: '2px 4px' }}>✏️</button>
                        <button className="icon-btn" onClick={() => handleDeleteNotice(n.id)} style={{ fontSize: '0.75rem', padding: '2px 4px' }}>🗑️</button>
                      </div>
                    )}
                  </div>
                  <div className="notice-card-title">{n.title}</div>
                  <div className="notice-card-content">{n.content}</div>
                </div>
              )) : (
                <div className="empty-state" style={{padding: '2rem', textAlign: 'center'}}>
                  <p style={{color: 'var(--text-secondary)'}}>등록된 공지사항이 없습니다.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
