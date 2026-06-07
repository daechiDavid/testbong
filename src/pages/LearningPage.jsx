import { useState, useRef, useEffect } from 'react';
import { ASSIGNMENTS } from '../data/mockData';
import { useApp } from '../context/AppContext';
import './LearningPage.css';

export default function LearningPage() {
  const { state, dispatch } = useApp();
  const { students } = state;

  const [isEditingActivity, setIsEditingActivity] = useState(false);
  const [tempActivityContent, setTempActivityContent] = useState(state.activityCheck?.content || '');
  const [lastRefreshed, setLastRefreshed] = useState(new Date());
  const timerRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      // 실제 서버가 연결되면 여기서 데이터를 다시 불러옵니다(fetch).
      setLastRefreshed(new Date());
    }, 30000); // 30초마다 실행

    return () => clearInterval(interval);
  }, []);

  const handlePointerDown = (studentId) => {
    timerRef.current = setTimeout(() => {
      if (state.activityCheck?.completions[studentId]) {
        dispatch({ type: 'CANCEL_ACTIVITY_COMPLETION', payload: studentId });
      }
      timerRef.current = null;
    }, 500);
  };

  const handlePointerUp = (studentId) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
      if (!state.activityCheck?.completions[studentId]) {
        dispatch({
          type: 'MARK_ACTIVITY_COMPLETED',
          payload: { studentId, timestamp: new Date().toISOString() }
        });
      }
    }
  };

  const handlePointerLeave = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  return (
    <div className="learning-page">
      {/* Activity Check Section */}
      <div className="activity-check-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1rem' }}>
          <h3 className="section-title" style={{ marginBottom: 0 }}><span>✅</span> 활동 완료 체크</h3>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
            <span style={{ marginRight: '4px' }}>🔄</span> 
            {lastRefreshed.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })} 업데이트됨
          </div>
        </div>
        <div className="activity-content-box">
          {state.isAdmin && isEditingActivity ? (
            <div className="activity-edit-mode">
              <input 
                type="text" 
                className="activity-input"
                value={tempActivityContent} 
                onChange={(e) => setTempActivityContent(e.target.value)}
                placeholder="활동 내용을 입력하세요"
                autoFocus
              />
              <div className="activity-edit-actions">
                <button className="activity-btn primary" onClick={() => {
                  dispatch({ type: 'UPDATE_ACTIVITY_CONTENT', payload: tempActivityContent });
                  setIsEditingActivity(false);
                }}>저장</button>
                <button className="activity-btn secondary" onClick={() => {
                  setTempActivityContent(state.activityCheck?.content || '');
                  setIsEditingActivity(false);
                }}>취소</button>
              </div>
            </div>
          ) : (
            <div className="activity-view-mode">
              <div className="activity-text">
                <span className="activity-label">활동 내용:</span>
                <span className="activity-value">{state.activityCheck?.content || '활동 내용이 없습니다.'}</span>
              </div>
              {state.isAdmin && (
                <button className="activity-btn edit" onClick={() => {
                  setTempActivityContent(state.activityCheck?.content || '');
                  setIsEditingActivity(true);
                }}>수정</button>
              )}
            </div>
          )}
        </div>
        
        <div className="activity-students-grid">
          {students.map(student => {
            const isCompleted = !!state.activityCheck?.completions[student.id];
            return (
              <div 
                key={student.id} 
                className={`activity-student-card ${isCompleted ? 'completed' : ''}`}
                onPointerDown={() => handlePointerDown(student.id)}
                onPointerUp={() => handlePointerUp(student.id)}
                onPointerLeave={handlePointerLeave}
                onContextMenu={(e) => e.preventDefault()}
              >
                <div className="student-number">{student.number}</div>
                <div className="student-name">{student.name}</div>
                {isCompleted && <div className="completed-check">✓</div>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Assignment Tracker */}
      <h3 className="section-title"><span>📝</span> 과제/수행평가 현황</h3>
      <div className="assignment-list">
        {ASSIGNMENTS.map(a => {
          const pct = Math.round((a.submitted / a.total) * 100);
          const remaining = a.total - a.submitted;
          return (
            <div key={a.id} className="assignment-card">
              <div className="assignment-icon" style={{background: a.type === '수행평가' ? '#EEF2FF' : '#ECFDF5'}}>
                {a.type === '수행평가' ? '📋' : '📝'}
              </div>
              <div className="assignment-details">
                <div className="assignment-title">{a.title}</div>
                <div className="assignment-info">
                  <span className={`badge ${a.type === '수행평가' ? 'badge-primary' : 'badge-success'}`}>{a.type}</span>
                  <span>{a.subject}</span>
                  <span>마감: {a.dueDate}</span>
                  {remaining > 0 && <span style={{color:'var(--danger)'}}>미제출 {remaining}명</span>}
                </div>
              </div>
              <div className="assignment-progress-bar">
                <div className="progress-bar">
                  <div className={`progress-fill ${pct >= 80 ? 'green' : pct >= 50 ? '' : 'red'}`} style={{width:`${pct}%`}} />
                </div>
              </div>
              <div className="assignment-percentage">{pct}%</div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
