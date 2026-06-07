import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { SCHEDULE, DDAY_EVENTS, ASSIGNMENTS } from '../data/mockData';
import { getDayName, getDday, isTodayBirthday, getCurrentPeriod } from '../utils/helpers';
import { fetchTodayLunch } from '../utils/neisApi';
import Thermometer from '../components/common/Thermometer';
import './DashboardPage.css';

export default function DashboardPage() {
  const { state } = useApp();
  const { students, attendance, announcements, settings } = state;

  const [lunchInfo, setLunchInfo] = useState(null);
  const [isLoadingLunch, setIsLoadingLunch] = useState(true);

  useEffect(() => {
    async function loadLunch() {
      setIsLoadingLunch(true);
      const data = await fetchTodayLunch();
      setLunchInfo(data);
      setIsLoadingLunch(false);
    }
    loadLunch();
  }, []);

  const today = new Date();
  const dayName = getDayName(today);
  const todaySchedule = SCHEDULE[dayName] || [];
  const currentPeriod = getCurrentPeriod();

  // Birthday students
  const birthdayStudents = students.filter(s => isTodayBirthday(s.birthday));

  // D-Day sorted
  const ddaySorted = [...DDAY_EVENTS].sort((a, b) => new Date(a.date) - new Date(b.date));

  // Points
  const totalPoints = students.reduce((sum, s) => sum + (s.points || 0), 0);
  const goalPoints = settings?.thermometerGoal || 1500;

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
      <div className="dashboard-layout">
        
        {/* Row 1: Schedule & Thermometer */}
        <div className="dashboard-row">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title"><span className="emoji">📚</span> 오늘의 시간표 ({dayName}요일)</h3>
            </div>
            {todaySchedule.length > 0 ? (
              <div className="schedule-list">
                {todaySchedule.map(item => (
                  <div key={item.period} className={`schedule-item ${currentPeriod === item.period ? 'current' : ''}`}>
                    <div className="schedule-period">{item.period}</div>
                    <div>
                      <div className="schedule-subject">{item.subject}</div>
                      <div className="schedule-time">{item.time}</div>
                    </div>
                    {currentPeriod === item.period && <span className="badge badge-primary" style={{marginLeft:'auto'}}>수업 중</span>}
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">🏖️</div>
                <p>오늘은 수업이 없습니다</p>
              </div>
            )}
          </div>
          <Thermometer current={totalPoints} goal={goalPoints} />
        </div>

        {/* Row 2: Assignments & Lunch */}
        <div className="dashboard-row">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title"><span className="emoji">📝</span> 과제 제출 현황</h3>
            </div>
            <div className="assignment-summary">
              {ASSIGNMENTS.slice(0, 4).map(a => {
                const pct = Math.round((a.submitted / a.total) * 100);
                return (
                  <div key={a.id} className="assignment-item">
                    <span className="assignment-name">{a.title}</span>
                    <div className="assignment-progress">
                      <div className="progress-bar">
                        <div className={`progress-fill ${pct >= 80 ? 'green' : pct >= 50 ? '' : 'red'}`} style={{width: `${pct}%`}} />
                      </div>
                    </div>
                    <span className="assignment-rate">{a.submitted}/{a.total}</span>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="card">
            <div className="card-header">
              <h3 className="card-title"><span className="emoji">🍱</span> 오늘의 급식</h3>
              <span className="badge badge-primary">하남중앙초</span>
            </div>
            <div className="lunch-content">
              {isLoadingLunch ? (
                <div className="empty-state" style={{ padding: '1rem' }}><p>식단표 불러오는 중...</p></div>
              ) : lunchInfo ? (
                <div className="lunch-menu-box" style={{ background: 'var(--gray-50)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                  <div className="lunch-menu-text" style={{ whiteSpace: 'pre-line', fontSize: '0.875rem', lineHeight: '1.7', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {lunchInfo.menu}
                  </div>
                  {lunchInfo.calories && (
                    <div className="lunch-calories" style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'right', fontWeight: 700 }}>
                      ⚡ {lunchInfo.calories}
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
        </div>

        {/* Row 3: D-Day & Notices */}
        <div className="dashboard-row">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title"><span className="emoji">📅</span> D-Day</h3>
            </div>
            <div className="dday-list">
              {ddaySorted.map((ev, i) => {
                const dday = getDday(ev.date);
                const isUrgent = parseInt(dday.replace('D-', '')) <= 7;
                return (
                  <div key={i} className="dday-item">
                    <div className="dday-info">
                      <span className="dday-emoji">{ev.emoji}</span>
                      <div>
                        <div className="dday-name">{ev.name}</div>
                        <div className="dday-date">{ev.date.slice(5).replace('-', '/')}</div>
                      </div>
                    </div>
                    <span className={`dday-badge ${isUrgent ? 'urgent' : ''}`}>{dday}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title"><span className="emoji">📢</span> 최근 공지</h3>
            </div>
            <div className="notice-list">
              {announcements.slice(0, 4).map(n => (
                <div key={n.id} className="notice-item">
                  <span className={`notice-type ${n.type}`}>
                    {n.type === 'important' ? '중요' : n.type === 'newsletter' ? '통신문' : '일반'}
                  </span>
                  <div className="notice-content">
                    <div className="notice-title">{n.title}</div>
                    <div className="notice-meta">{n.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
