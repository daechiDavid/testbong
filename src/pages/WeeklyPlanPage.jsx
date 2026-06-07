import { useState } from 'react';
import { useApp } from '../context/AppContext';
import './WeeklyPlanPage.css';

export default function WeeklyPlanPage() {
  const { state, dispatch, showToast } = useApp();
  const { weeklyPlans, isAdmin } = state;
  const currentWeek = weeklyPlans[0];

  const [editing, setEditing] = useState(null); // { day, period }
  const [editSubject, setEditSubject] = useState('');
  const [editContent, setEditContent] = useState('');

  const days = ['월', '화', '수', '목', '금'];
  const periods = [1, 2, 3, 4, 5, 6];

  const handleEdit = (day, period, subject, content) => {
    if (!isAdmin) return;
    setEditing({ day, period });
    setEditSubject(subject || '');
    setEditContent(content || '');
  };

  const handleSave = () => {
    dispatch({
      type: 'SET_WEEKLY_PLAN',
      payload: { weekId: currentWeek.id, day: editing.day, period: editing.period, subject: editSubject, content: editContent }
    });
    setEditing(null);
    showToast('주간 일정이 저장되었습니다.', 'success');
  };

  return (
    <div className="weekly-page">
      <div className="weekly-header">
        <h2 className="section-title">📅 주간 교육일정</h2>
        <span className="weekly-date">{currentWeek?.weekStart} ~ {currentWeek?.weekEnd}</span>
      </div>

      {isAdmin && <p className="weekly-tip">💡 빈 칸을 클릭하면 내용을 수정할 수 있습니다.</p>}

      <div className="weekly-table-wrapper card">
        <table className="weekly-table">
          <thead>
            <tr>
              <th className="period-col">교시</th>
              {days.map(d => <th key={d}>{d}요일</th>)}
            </tr>
          </thead>
          <tbody>
            {periods.map(p => (
              <tr key={p}>
                <td className="period-cell">{p}</td>
                {days.map(d => {
                  const plan = currentWeek?.plans?.[d]?.[p] || {};
                  const isEditing = editing?.day === d && editing?.period === p;
                  return (
                    <td 
                      key={d} 
                      className={`plan-cell ${isAdmin ? 'editable' : ''} ${isEditing ? 'is-editing' : ''}`} 
                      onClick={() => !isEditing && handleEdit(d, p, plan.subject, plan.content)}
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
