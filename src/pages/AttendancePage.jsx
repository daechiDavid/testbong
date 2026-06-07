import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getAvatarColor, getInitials } from '../utils/helpers';
import './AttendancePage.css';

const STATUS_MAP = {
  present: { label: '출석', icon: '✅', color: 'present' },
  absent: { label: '결석', icon: '❌', color: 'absent' },
  late: { label: '지각', icon: '⏰', color: 'late' },
  'early-leave': { label: '조퇴', icon: '🏃', color: 'early-leave' },
};

export default function AttendancePage() {
  const { state, updateAttendance, showToast, isAdmin } = useApp();
  const { students, attendance } = state;
  const [activeSelector, setActiveSelector] = useState(null);

  const counts = {
    present: Object.values(attendance).filter(a => a.status === 'present').length,
    absent: Object.values(attendance).filter(a => a.status === 'absent').length,
    late: Object.values(attendance).filter(a => a.status === 'late').length,
    'early-leave': Object.values(attendance).filter(a => a.status === 'early-leave').length,
  };

  const handleStatus = (studentId, status) => {
    updateAttendance(studentId, status);
    const s = students.find(st => st.id === studentId);
    showToast(`${s.name} → ${STATUS_MAP[status].label}`, 'success');
    setActiveSelector(null);
  };

  return (
    <div className="attendance-page">
      <div className="attendance-controls">
        <div className="date-display-box">
          <span className="date-display-icon">📅</span>
          <span className="date-display-text">오늘의 출석 체크</span>
        </div>
        <div className="attendance-summary-bar">
          {Object.entries(STATUS_MAP).map(([key, val]) => (
            <div key={key} className={`attendance-count ${val.color}`}>
              <span>{val.icon}</span>
              <span>{val.label}</span>
              <span className="count-num">{counts[key]}</span>
            </div>
          ))}
        </div>
      </div>

      {isAdmin && <p className="attendance-tip">💡 학생 카드를 클릭하면 출석 상태를 변경할 수 있습니다.</p>}

      <div className="attendance-grid">
        {students.map(s => {
          const att = attendance[s.id] || { status: 'present' };
          const info = STATUS_MAP[att.status];
          return (
            <div
              key={s.id}
              className={`attendance-cell ${att.status}`}
              onClick={() => { if (isAdmin) setActiveSelector(activeSelector === s.id ? null : s.id); }}
            >
              <div className="student-num">{s.number}번</div>
              <div className="student-name">{s.name}</div>
              <div className="status-icon">{info.icon}</div>
              {att.note && <div className="att-note">{att.note}</div>}

              {activeSelector === s.id && (
                <div className="attendance-status-selector show" onClick={e => e.stopPropagation()}>
                  {Object.entries(STATUS_MAP).map(([key, val]) => (
                    <button key={key} className={`status-option ${att.status === key ? 'active' : ''}`} onClick={() => handleStatus(s.id, key)}>
                      {val.icon} {val.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Attendance Rate Chart (Simple Bar) */}
      <div className="card" style={{marginTop:'1.5rem'}}>
        <div className="card-header">
          <h3 className="card-title"><span className="emoji">📊</span> 출석 현황 요약</h3>
        </div>
        <div className="att-chart">
          {Object.entries(STATUS_MAP).map(([key, val]) => {
            const pct = Math.round((counts[key] / students.length) * 100);
            return (
              <div key={key} className="att-chart-row">
                <span className="att-chart-label">{val.icon} {val.label}</span>
                <div className="att-chart-bar-bg">
                  <div className={`att-chart-bar-fill ${key}`} style={{width:`${pct}%`}} />
                </div>
                <span className="att-chart-value">{counts[key]}명 ({pct}%)</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
