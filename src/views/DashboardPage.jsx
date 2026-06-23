import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { getDayName, getDday, isTodayBirthday, getCurrentPeriod } from '../utils/helpers';
import { fetchTodayLunch } from '../utils/neisApi';
import { getWeekStart, toISODate } from '../context/AppContext';
import Thermometer from '../components/common/Thermometer';
import { Responsive, WidthProvider } from 'react-grid-layout/legacy';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import './DashboardPage.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

const defaultLayouts = {
  lg: [
    { i: 'schedule', x: 0, y: 0, w: 6, h: 2 },
    { i: 'thermometer', x: 6, y: 0, w: 6, h: 2 },
    { i: 'lunch', x: 0, y: 2, w: 6, h: 2 },
    { i: 'dday', x: 6, y: 2, w: 6, h: 2 },
    { i: 'ranking', x: 0, y: 4, w: 6, h: 2 },
    { i: 'notice', x: 6, y: 4, w: 6, h: 2 }
  ],
  md: [
    { i: 'schedule', x: 0, y: 0, w: 5, h: 2 },
    { i: 'thermometer', x: 5, y: 0, w: 5, h: 2 },
    { i: 'lunch', x: 0, y: 2, w: 5, h: 2 },
    { i: 'dday', x: 5, y: 2, w: 5, h: 2 },
    { i: 'ranking', x: 0, y: 4, w: 5, h: 2 },
    { i: 'notice', x: 5, y: 4, w: 5, h: 2 }
  ],
  sm: [
    { i: 'schedule', x: 0, y: 0, w: 6, h: 2 },
    { i: 'thermometer', x: 0, y: 2, w: 6, h: 2 },
    { i: 'lunch', x: 0, y: 4, w: 6, h: 2 },
    { i: 'dday', x: 0, y: 6, w: 6, h: 2 },
    { i: 'ranking', x: 0, y: 8, w: 6, h: 2 },
    { i: 'notice', x: 0, y: 10, w: 6, h: 2 }
  ],
  xs: [
    { i: 'schedule', x: 0, y: 0, w: 4, h: 2 },
    { i: 'thermometer', x: 0, y: 2, w: 4, h: 2 },
    { i: 'lunch', x: 0, y: 4, w: 4, h: 2 },
    { i: 'dday', x: 0, y: 6, w: 4, h: 2 },
    { i: 'ranking', x: 0, y: 8, w: 4, h: 2 },
    { i: 'notice', x: 0, y: 10, w: 4, h: 2 }
  ],
  xxs: [
    { i: 'schedule', x: 0, y: 0, w: 2, h: 2 },
    { i: 'thermometer', x: 0, y: 2, w: 2, h: 2 },
    { i: 'lunch', x: 0, y: 4, w: 2, h: 2 },
    { i: 'dday', x: 0, y: 6, w: 2, h: 2 },
    { i: 'ranking', x: 0, y: 8, w: 2, h: 2 },
    { i: 'notice', x: 0, y: 10, w: 2, h: 2 }
  ]
};

export default function DashboardPage() {
  // AppContext에서 DB 연동 함수들을 가져옴
  const { state, dispatch, showToast, updateSettings, addDDay, deleteDDay, addAnnouncement, updateAnnouncement, deleteAnnouncement } = useApp();
  const { students, announcements, settings, weeklyPlans, ddays = [], isAdmin } = state;

  const [layouts, setLayouts] = useState(() => {
    try {
      const saved = localStorage.getItem('dashboard_layouts');
      if (saved) {
        const parsed = JSON.parse(saved);
        // 저장된 레이아웃 중 static 속성이 오염되어 드래그가 고정되는 현상을 수정합니다.
        Object.keys(parsed).forEach(breakpoint => {
          parsed[breakpoint] = parsed[breakpoint].map(item => ({
            ...item,
            static: false // 강제로 static(고정) 속성을 비활성화하여 이동 가능하도록 함
          }));
        });
        return parsed;
      }
      return defaultLayouts;
    } catch {
      // 로컬 스토리지 파싱 실패 시 기본 레이아웃 사용
      return defaultLayouts;
    }
  });

  const [lunchInfo, setLunchInfo] = useState(null);
  const [isLoadingLunch, setIsLoadingLunch] = useState(true);
  const [showDdayForm, setShowDdayForm] = useState(false);
  const [newDday, setNewDday] = useState({ name: '', date: '', emoji: '🎉' });

  useEffect(() => {
    async function loadLunch() {
      setIsLoadingLunch(true);
      const data = await fetchTodayLunch();
      setLunchInfo(data);
      setIsLoadingLunch(false);
    }
    loadLunch();
  }, []);

  // 공지사항 관리 상태 (CalendarPage에서 이동)
  const [newNotice, setNewNotice] = useState({ title: '', content: '', type: 'general' });
  const [showNoticeForm, setShowNoticeForm] = useState(false);
  const [editNoticeId, setEditNoticeId] = useState(null);

  // 날짜, 시간 계산
  const today = new Date();
  const dayName = getDayName(today);
  const currentPeriod = getCurrentPeriod();

  // 공지사항 핸들러
  const handleAddNotice = async () => {
    if (!newNotice.title.trim()) return;
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    if (editNoticeId) {
      await updateAnnouncement({ id: editNoticeId, ...newNotice, date: dateStr });
      showToast('공지사항이 수정되었습니다', 'success');
    } else {
      const newId = crypto.randomUUID();
      await addAnnouncement({ id: newId, ...newNotice, date: dateStr });
      showToast('공지사항이 등록되었습니다', 'success');
    }

    setNewNotice({ title: '', content: '', type: 'general' });
    setShowNoticeForm(false);
    setEditNoticeId(null);
  };

  const handleEditNotice = (n) => {
    setNewNotice({ title: n.title, content: n.content, type: n.type });
    setEditNoticeId(n.id);
    setShowNoticeForm(true);
  };

  const handleDeleteNotice = async (id) => {
    if (confirm('이 공지사항을 삭제하시겠습니까?')) {
      await deleteAnnouncement(id);
      showToast('공지사항이 삭제되었습니다', 'success');
    }
  };

  // 주간일정에서 오늘의 시간표 읽기
  const weekStart = getWeekStart(today);
  const weekKey = toISODate(weekStart);
  const todayPlan = weeklyPlans[weekKey]?.[dayName] || {};

  const PERIOD_TIMES = {
    1: '09:00-09:40',
    2: '09:50-10:30',
    3: '10:40-11:20',
    4: '11:30-12:10',
    5: '13:10-13:50',
    6: '14:00-14:40',
  };

  const todaySchedule = Object.keys(todayPlan)
    .map(Number)
    .sort((a, b) => a - b)
    .filter(p => todayPlan[p]?.subject)
    .map(p => ({
      period: p,
      subject: todayPlan[p].subject,
      content: todayPlan[p].content || '',
      time: PERIOD_TIMES[p] || '',
    }));

  // Birthday students
  const birthdayStudents = students.filter(s => isTodayBirthday(s.birthday));

  // D-Day sorted
  const ddaySorted = [...ddays].sort((a, b) => new Date(a.date) - new Date(b.date));

  // D-Day 추가: DB에도 저장 (addDDay 함수 사용)
  const handleAddDday = async () => {
    if (!newDday.name || !newDday.date) {
      showToast('이름과 날짜를 입력해주세요.', 'error');
      return;
    }
    await addDDay({ name: newDday.name, date: newDday.date, emoji: newDday.emoji });
    setNewDday({ name: '', date: '', emoji: '🎉' });
    setShowDdayForm(false);
    showToast('D-Day가 추가되었습니다.', 'success');
  };

  // D-Day 삭제: DB에서도 삭제 (deleteDDay 함수 사용)
  const handleDeleteDday = async (id) => {
    await deleteDDay(id);
  };

  const handleUpdateThermometer = async (goal, reward) => {
    await updateSettings({ ...settings, thermometerGoal: goal, thermometerReward: reward });
    showToast('우리반 온도계 설정이 변경되었습니다.', 'success');
  };

  // Points Ranking
  const topStudents = [...students].sort((a, b) => (b.points || 0) - (a.points || 0)).slice(0, 5);
  const totalPoints = students.reduce((sum, s) => sum + (s.points || 0), 0);
  const goalPoints = settings?.thermometerGoal || 1500;
  const thermometerReward = settings?.thermometerReward || '';

  const handleLayoutChange = (currentLayout, allLayouts) => {
    if (isAdmin) {
      setLayouts(allLayouts);
      localStorage.setItem('dashboard_layouts', JSON.stringify(allLayouts));
    }
  };

  return (
    <div className="dashboard-page">
      {/* Birthday Alert */}
      {birthdayStudents.length > 0 && (
        <div className="birthday-card">
          <span className="birthday-emoji">🎂</span>
          <div className="birthday-text">
            <div className="birthday-name">
              🎉 오늘은 {birthdayStudents.map(s => s.name).join(', ')} 학생의 생일입니다!
            </div>
            <div className="birthday-sub">축하해 주세요! 🎈</div>
          </div>
        </div>
      )}

      {/* Main Layout */}
      {/* 대시보드 위젯 그리드 레이아웃: 블럭 이동 및 크기 조절 가능 */}
      <ResponsiveGridLayout
        className="dashboard-layout"
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={220}
        onLayoutChange={handleLayoutChange}
        isDraggable={isAdmin}
        isResizable={isAdmin}
        draggableHandle=".card-header"
      >
        {/* Schedule */}
        <div key="schedule" className="card dashboard-widget">
          <div className="card-header" style={{ cursor: isAdmin ? 'move' : 'default' }}>
            <h3 className="card-title"><span className="emoji">📚</span> 오늘의 시간표 ({dayName}요일)</h3>
          </div>
          <div className="widget-content">
            {todaySchedule.length > 0 ? (
              <div className="schedule-list">
                {todaySchedule.map(item => (
                  <div key={item.period} className={`schedule-item ${currentPeriod === item.period ? 'current' : ''}`}>
                    <div className="schedule-period">{item.period}</div>
                    <div>
                      <div className="schedule-subject">{item.subject}</div>
                      <div className="schedule-time">{item.time}</div>
                      {item.content && <div className="schedule-content" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{item.content}</div>}
                    </div>
                    {currentPeriod === item.period && <span className="badge badge-primary" style={{ marginLeft: 'auto' }}>수업 중</span>}
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">🏖️</div>
                <p>오늘은 수업이 없습니다</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>주간 일정에서 시간표를 입력해주세요</p>
              </div>
            )}
          </div>
        </div>

        {/* Thermometer */}
        <div key="thermometer" className="card dashboard-widget">
          <Thermometer
            current={totalPoints}
            goal={goalPoints}
            reward={thermometerReward}
            isAdmin={isAdmin}
            onUpdate={handleUpdateThermometer}
          />
        </div>

        {/* Lunch */}
        <div key="lunch" className="card dashboard-widget">
          <div className="card-header" style={{ cursor: isAdmin ? 'move' : 'default' }}>
            <h3 className="card-title"><span className="emoji">🍱</span> 오늘의 급식</h3>
            <span className="badge badge-primary">하남중앙초</span>
          </div>
          <div className="widget-content lunch-content">
            {isLoadingLunch ? (
              <div className="empty-state" style={{ padding: '1rem' }}><p>식단표 불러오는 중...</p></div>
            ) : lunchInfo ? (
              <div className="lunch-menu-box pretty-lunch-box">
                <div className="lunch-menu-text">{lunchInfo.menu}</div>
                {lunchInfo.calories && (
                  <div className="lunch-calories">
                    <span className="cal-icon">⚡</span><span>{lunchInfo.calories}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="empty-state" style={{ padding: '1rem' }}>
                <p>오늘의 급식 정보가 없습니다.</p>
              </div>
            )}
          </div>
        </div>

        {/* D-Day */}
        <div key="dday" className="card dashboard-widget">
          <div className="card-header" style={{ cursor: isAdmin ? 'move' : 'default' }}>
            <h3 className="card-title"><span className="emoji">📅</span> D-Day</h3>
            {isAdmin && (
              <button className="icon-btn" onClick={() => setShowDdayForm(!showDdayForm)}>{showDdayForm ? '❌' : '➕'}</button>
            )}
          </div>
          <div className="widget-content">
            {showDdayForm && isAdmin && (
              <div className="dday-form" style={{ padding: '1rem', background: 'var(--gray-50)', borderRadius: 'var(--radius-md)', marginBottom: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <input type="text" placeholder="이모지" value={newDday.emoji} onChange={e => setNewDday({ ...newDday, emoji: e.target.value })} className="form-input" style={{ width: '60px' }} />
                <input type="text" placeholder="내용" value={newDday.name} onChange={e => setNewDday({ ...newDday, name: e.target.value })} className="form-input" style={{ flex: 1 }} />
                <input type="date" value={newDday.date} onChange={e => setNewDday({ ...newDday, date: e.target.value })} className="form-input" />
                <button className="btn btn-primary" onClick={handleAddDday}>추가</button>
              </div>
            )}
            <div className="dday-list">
              {ddaySorted.length === 0 ? (
                <div className="empty-state"><p>등록된 D-Day가 없습니다.</p></div>
              ) : (
                ddaySorted.map((ev, i) => {
                  const dday = getDday(ev.date);
                  const isUrgent = parseInt(dday.replace('D-', '')) <= 7;
                  return (
                    <div key={ev.id || i} className="dday-item">
                      <div className="dday-info">
                        <span className="dday-emoji">{ev.emoji}</span>
                        <div>
                          <div className="dday-name">{ev.name}</div>
                          <div className="dday-date">{ev.date.slice(5).replace('-', '/')}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span className={`dday-badge ${isUrgent ? 'urgent' : ''}`}>{dday}</span>
                        {isAdmin && <button className="icon-btn delete-btn" style={{ fontSize: '0.75rem', padding: '2px 4px' }} onClick={() => handleDeleteDday(ev.id)}>🗑️</button>}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Ranking */}
        <div key="ranking" className="card dashboard-widget">
          <div className="card-header" style={{ cursor: isAdmin ? 'move' : 'default' }}>
            <h3 className="card-title"><span className="emoji">🏆</span> 칭찬 랭킹 (Top 5)</h3>
          </div>
          <div className="widget-content ranking-list">
            {topStudents.map((student, idx) => (
              <div key={student.id} className="ranking-item">
                <div className="ranking-rank">
                  {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}`}
                </div>
                <div className="ranking-name">{student.name}</div>
                <div className="ranking-score">{student.points || 0}점</div>
              </div>
            ))}
          </div>
        </div>

        {/* Notice (CalendarPage에서 이식됨) */}
        <div key="notice" className="card dashboard-widget notice-card-container">
          <div className="card-header" style={{ cursor: isAdmin ? 'move' : 'default' }}>
            <h3 className="card-title"><span className="emoji">📢</span> 공지사항</h3>
            {isAdmin && <button className="btn btn-sm btn-primary" onClick={() => setShowNoticeForm(!showNoticeForm)}>+ 새 공지</button>}
          </div>
          <div className="widget-content notice-list">
            {isAdmin && showNoticeForm && (
              <div className="notice-form" style={{ padding: '1rem', background: 'var(--gray-50)', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
                <input className="form-input" placeholder="제목" value={newNotice.title} onChange={e => setNewNotice({ ...newNotice, title: e.target.value })} style={{ marginBottom: '0.5rem' }} />
                <textarea className="form-input" placeholder="내용" value={newNotice.content} onChange={e => setNewNotice({ ...newNotice, content: e.target.value })} rows="3" style={{ marginBottom: '0.5rem', resize: 'vertical' }} />
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <select className="form-input" value={newNotice.type} onChange={e => setNewNotice({ ...newNotice, type: e.target.value })} style={{ flex: 1 }}>
                    <option value="general">일반</option>
                    <option value="important">중요</option>
                    <option value="newsletter">통신문</option>
                  </select>
                  <button className="btn btn-primary" onClick={handleAddNotice}>{editNoticeId ? '수정' : '등록'}</button>
                  {editNoticeId && <button className="btn btn-secondary" onClick={() => { setShowNoticeForm(false); setEditNoticeId(null); setNewNotice({ title: '', content: '', type: 'general' }) }}>취소</button>}
                </div>
              </div>
            )}

            <div className="notices-list">
              {announcements.length > 0 ? announcements.map(n => (
                <div key={n.id} className="notice-item" style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '1rem', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', marginBottom: '0.75rem', background: 'white' }}>
                  <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className={`notice-type ${n.type}`}>{n.type === 'important' ? '중요' : n.type === 'newsletter' ? '통신문' : '일반'}</span>
                      <span className="notice-meta">{n.date}</span>
                    </div>
                    {isAdmin && (
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button className="icon-btn" onClick={() => handleEditNotice(n)} style={{ fontSize: '0.75rem', padding: '2px 4px' }}>✏️</button>
                        <button className="icon-btn delete-btn" onClick={() => handleDeleteNotice(n.id)} style={{ fontSize: '0.75rem', padding: '2px 4px' }}>🗑️</button>
                      </div>
                    )}
                  </div>
                  <div className="notice-title" style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.5rem' }}>{n.title}</div>
                  <div className="notice-content" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>{n.content}</div>
                </div>
              )) : (
                <div className="empty-state"><p>등록된 공지사항이 없습니다.</p></div>
              )}
            </div>
          </div>
        </div>

      </ResponsiveGridLayout>
    </div>
  );
}
