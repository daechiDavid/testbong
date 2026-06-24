import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import './AttendancePage.css';

const STATUS_MAP = {
  present: { label: '출석', icon: '✅', color: 'present' },
  absent: { label: '결석', icon: '❌', color: 'absent' },
  late: { label: '지각', icon: '⏰', color: 'late' },
  'early-leave': { label: '조퇴', icon: '🏃', color: 'early-leave' },
};

export default function AttendancePage() {
  const { state, updateAttendance, loadAttendanceByDate, loadMonthlyAttendance, showToast } = useApp();
  const { students, attendance, selectedAttendanceDate, monthlyAttendance, isAdmin } = state;
  const [activeSelector, setActiveSelector] = useState(null);
  const [monthlyActiveCell, setMonthlyActiveCell] = useState(null); // { studentId, date }
  const [viewMode, setViewMode] = useState('daily'); // daily | monthly
  const [monthYear, setMonthYear] = useState({ year: new Date().getFullYear(), month: new Date().getMonth() });

  // 날짜 변경 시 데이터 로드
  const handleDateChange = (e) => {
    const date = e.target.value;
    loadAttendanceByDate(date);
  };

  // 월별 출결 변경 핸들러
  const handleMonthlyStatus = async (studentId, date, status) => {
    if (!isAdmin) {
      showToast('관리자 모드에서만 수정할 수 있습니다.', 'error');
      return;
    }
    await updateAttendance(studentId, status, '', date);
    const s = students.find(st => st.id === studentId);
    showToast(`${s.name} (${date.slice(5).replace('-', '/')}) → ${STATUS_MAP[status].label}`, 'success');
    setMonthlyActiveCell(null);
  };

  // 월별 보기 시 데이터 로드
  useEffect(() => {
    if (viewMode === 'monthly') {
      loadMonthlyAttendance(monthYear.year, monthYear.month);
    }
  }, [viewMode, monthYear, loadMonthlyAttendance]);

  const counts = {
    present: Object.values(attendance).filter(a => a.status === 'present').length,
    absent: Object.values(attendance).filter(a => a.status === 'absent').length,
    late: Object.values(attendance).filter(a => a.status === 'late').length,
    'early-leave': Object.values(attendance).filter(a => a.status === 'early-leave').length,
  };

  const handleStatus = (studentId, status) => {
    if (!isAdmin) {
      showToast('관리자 모드에서만 수정할 수 있습니다.', 'error');
      return;
    }
    updateAttendance(studentId, status, '', selectedAttendanceDate);
    const s = students.find(st => st.id === studentId);
    showToast(`${s.name} → ${STATUS_MAP[status].label}`, 'success');
    setActiveSelector(null);
  };

  const handleSaveAllToday = async () => {
    if (!isAdmin) return;
    
    // 순차적 처리로 변경 (서버 과부하 방지)
    for (const s of students) {
      const att = attendance[s.id] || { status: 'present', note: '' };
      await updateAttendance(s.id, att.status, att.note || '', selectedAttendanceDate);
    }
    
    showToast('오늘의 출석 현황이 모두 저장되었습니다.', 'success');
  };

  // 월별 날짜 목록 생성
  const getDaysInMonth = (year, month) => {
    const days = [];
    const lastDay = new Date(year, month + 1, 0).getDate();
    for (let d = 1; d <= lastDay; d++) {
      const date = new Date(year, month, d);
      const dow = date.getDay();
      if (dow !== 0 && dow !== 6) { // 주말 제외
        days.push(`${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`);
      }
    }
    return days;
  };

  const monthDays = getDaysInMonth(monthYear.year, monthYear.month);
  const monthLabel = `${monthYear.year}년 ${monthYear.month + 1}월`;

  return (
    <div className="attendance-page">
      {/* View Mode Toggle */}
      <div className="attendance-view-toggle">
        <button 
          className={`view-tab ${viewMode === 'daily' ? 'active' : ''}`} 
          onClick={() => setViewMode('daily')}
        >
          📋 일별 출석
        </button>
        <button 
          className={`view-tab ${viewMode === 'monthly' ? 'active' : ''}`} 
          onClick={() => setViewMode('monthly')}
        >
          📊 월별 현황
        </button>
      </div>

      {viewMode === 'daily' ? (
        <>
          <div className="attendance-controls">
            <div className="date-display-box">
              <span className="date-display-icon">📅</span>
              <input 
                type="date" 
                className="attendance-date-input"
                value={selectedAttendanceDate}
                onChange={handleDateChange}
              />
            </div>
            {isAdmin && (
              <button className="save-attendance-btn" onClick={handleSaveAllToday}>
                오늘의 출석 입력 완료
              </button>
            )}
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
                  style={{ zIndex: activeSelector === s.id ? 100 : 1 }}
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
        </>
      ) : (
        /* Monthly View */
        <div className="monthly-attendance">
          <div className="monthly-nav">
            <button className="month-nav-btn" onClick={() => {
              if (monthYear.month === 0) setMonthYear({ year: monthYear.year - 1, month: 11 });
              else setMonthYear({ ...monthYear, month: monthYear.month - 1 });
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <span className="month-label">{monthLabel}</span>
            <button className="month-nav-btn" onClick={() => {
              if (monthYear.month === 11) setMonthYear({ year: monthYear.year + 1, month: 0 });
              else setMonthYear({ ...monthYear, month: monthYear.month + 1 });
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </div>

          <div className="monthly-table-wrapper">
            <table className="monthly-table">
              <thead>
                <tr>
                  <th className="sticky-col">번호</th>
                  <th className="sticky-col-name">이름</th>
                  {monthDays.map(d => {
                    const date = new Date(d);
                    const dayNum = date.getDate();
                    const dayNames = ['일','월','화','수','목','금','토'];
                    const dayName = dayNames[date.getDay()];
                    return (
                      <th key={d} className="date-col">
                        <div className="date-header">
                          <span>{dayNum}</span>
                          <span className="date-dow">{dayName}</span>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {students.map(s => (
                  <tr key={s.id}>
                    <td className="sticky-col">{s.number}</td>
                    <td className="sticky-col-name">{s.name}</td>
                    {monthDays.map(d => {
                      const record = monthlyAttendance[d]?.[s.id];
                      const status = record?.status || null;
                      const statusInfo = status ? STATUS_MAP[status] : null;
                      const isCellActive = monthlyActiveCell?.studentId === s.id && monthlyActiveCell?.date === d;
                      return (
                        <td 
                          key={d} 
                          className={`monthly-cell ${status || 'no-data'} ${isCellActive ? 'active' : ''}`} 
                          title={record?.note || ''}
                          onClick={() => {
                            if (isAdmin) {
                              setMonthlyActiveCell(isCellActive ? null : { studentId: s.id, date: d });
                            }
                          }}
                          style={{ position: 'relative', cursor: isAdmin ? 'pointer' : 'default' }}
                        >
                          {statusInfo ? (
                            <span className={`monthly-status ${status}`}>
                              {status === 'present' ? '○' : status === 'absent' ? '✕' : status === 'late' ? '△' : '▽'}
                            </span>
                          ) : (
                            <span className="monthly-status no-data">-</span>
                          )}

                          {/* 월별 출결 즉시 변경 선택기 */}
                          {isAdmin && isCellActive && (
                            <div className="attendance-status-selector show monthly-selector" onClick={e => e.stopPropagation()}>
                              {Object.entries(STATUS_MAP).map(([key, val]) => (
                                <button 
                                  key={key} 
                                  className={`status-option ${status === key ? 'active' : ''}`} 
                                  onClick={() => handleMonthlyStatus(s.id, d, key)}
                                >
                                  {val.icon} {val.label}
                                </button>
                              ))}
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="monthly-legend">
            <span className="legend-item"><span className="legend-icon present">○</span> 출석</span>
            <span className="legend-item"><span className="legend-icon absent">✕</span> 결석</span>
            <span className="legend-item"><span className="legend-icon late">△</span> 지각</span>
            <span className="legend-item"><span className="legend-icon early-leave">▽</span> 조퇴</span>
            <span className="legend-item"><span className="legend-icon no-data">-</span> 기록 없음</span>
          </div>
        </div>
      )}
    </div>
  );
}
