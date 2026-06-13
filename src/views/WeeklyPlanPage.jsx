import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { getWeekStart, toISODate } from '../context/AppContext';
import './WeeklyPlanPage.css';

export default function WeeklyPlanPage() {
  const { state, showToast, saveWeeklyPlan } = useApp();
  const { weeklyPlans, isAdmin } = state;

  const [currentDate, setCurrentDate] = useState(new Date());
  const [editing, setEditing] = useState(null);
  const [editSubject, setEditSubject] = useState('');
  const [editContent, setEditContent] = useState('');

  const days = ['월', '화', '수', '목', '금'];
  const periods = [1, 2, 3, 4, 5, 6];

  // 현재 주차 계산
  const weekStart = useMemo(() => getWeekStart(currentDate), [currentDate]);
  const weekKey = toISODate(weekStart);

  // 각 요일의 날짜 계산
  const dayDates = useMemo(() => {
    return days.map((d, i) => {
      const date = new Date(weekStart);
      date.setDate(date.getDate() + i);
      return {
        day: d,
        date: date,
        dateStr: `${date.getMonth() + 1}/${date.getDate()}`,
        isoDate: toISODate(date)
      };
    });
  }, [weekStart]);

  const weekEndDate = new Date(weekStart);
  weekEndDate.setDate(weekEndDate.getDate() + 4);

  const currentWeekPlans = weeklyPlans[weekKey] || {};

  // 오늘 날짜
  const todayStr = toISODate(new Date());
  const isCurrentWeek = dayDates.some(dd => dd.isoDate === todayStr);

  const goToPrevWeek = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() - 7);
    setCurrentDate(d);
    setEditing(null);
  };

  const goToNextWeek = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + 7);
    setCurrentDate(d);
    setEditing(null);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setEditing(null);
  };

  const handleEdit = (day, period, subject, content) => {
    if (!isAdmin) return;
    setEditing({ day, period });
    setEditSubject(subject || '');
    setEditContent(content || '');
  };

  const handleSave = () => {
    saveWeeklyPlan(weekKey, editing.day, editing.period, editSubject, editContent);
    setEditing(null);
    showToast('주간 일정이 저장되었습니다.', 'success');
  };

  return (
    <div className="weekly-page">
      <div className="weekly-header">
        <h2 className="section-title">📅 주간 교육일정</h2>
        <div className="weekly-nav">
          <button className="week-nav-btn" onClick={goToPrevWeek}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
            이전 주
          </button>
          {!isCurrentWeek && (
            <button className="week-nav-btn today-btn" onClick={goToToday}>
              오늘
            </button>
          )}
          <span className="weekly-date">
            {weekStart.getMonth() + 1}/{weekStart.getDate()} ~ {weekEndDate.getMonth() + 1}/{weekEndDate.getDate()}
          </span>
          <button className="week-nav-btn" onClick={goToNextWeek}>
            다음 주
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>
      </div>

      {isAdmin && <p className="weekly-tip">💡 빈 칸을 클릭하면 내용을 수정할 수 있습니다.</p>}

      <div className="weekly-table-wrapper card">
        <table className="weekly-table">
          <thead>
            <tr>
              <th className="period-col">교시</th>
              {dayDates.map(dd => (
                <th key={dd.day} className={dd.isoDate === todayStr ? 'today-col' : ''}>
                  <div className="day-header">
                    <span className="day-name">{dd.day}요일</span>
                    <span className="day-date">{dd.dateStr}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {periods.map(p => (
              <tr key={p}>
                <td className="period-cell">{p}</td>
                {dayDates.map(dd => {
                  const plan = currentWeekPlans[dd.day]?.[p] || {};
                  const isEditing = editing?.day === dd.day && editing?.period === p;
                  const isToday = dd.isoDate === todayStr;
                  return (
                    <td 
                      key={dd.day} 
                      className={`plan-cell ${isAdmin ? 'editable' : ''} ${isEditing ? 'is-editing' : ''} ${isToday ? 'today-cell' : ''}`} 
                      onClick={() => !isEditing && handleEdit(dd.day, p, plan.subject, plan.content)}
                    >
                      {isEditing ? (
                        <div className="plan-edit-form" onClick={e => e.stopPropagation()}>
                          <input 
                            className="form-input plan-subject-input" 
                            placeholder="과목 (예: 국어)" 
                            value={editSubject} 
                            onChange={e => setEditSubject(e.target.value)} 
                            autoFocus 
                          />
                          <input 
                            className="form-input plan-content-input" 
                            placeholder="학습 내용 입력..." 
                            value={editContent} 
                            onChange={e => setEditContent(e.target.value)} 
                            onKeyDown={e => e.key === 'Enter' && handleSave()} 
                          />
                          <div className="plan-edit-actions">
                            <button className="btn btn-sm btn-primary" onClick={handleSave}>저장</button>
                            <button className="btn btn-sm btn-secondary" onClick={() => setEditing(null)}>취소</button>
                          </div>
                        </div>
                      ) : (
                        <div className="plan-display">
                          {plan.subject && <div className="plan-subject">{plan.subject}</div>}
                          {plan.content && <div className="plan-content">{plan.content}</div>}
                          {!plan.subject && !plan.content && <div className="plan-empty">-</div>}
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
    </div>
  );
}
