import { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import './LearningPage.css';

export default function LearningPage() {
  const { state, dispatch, showToast } = useApp();
  const { students, assignments, isAdmin } = state;

  const [isEditingActivity, setIsEditingActivity] = useState(false);
  const [tempActivityContent, setTempActivityContent] = useState(state.activityCheck?.content || '');
  const [tempActivityType, setTempActivityType] = useState(state.activityCheck?.type || '수행평가');
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const timerRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setLastRefreshed(new Date());
    }, 30000);
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

        // 활동 완료 시 과제/수행평가 탭에 데이터 추가
        const activityContent = state.activityCheck?.content || '활동';
        const todayStr = new Date().toISOString().split('T')[0];

        // 오늘 같은 활동 내용의 과제가 이미 있는지 확인
        const existingAssignment = assignments.find(
          a => a.title === activityContent && a.dueDate === todayStr
        );

        if (existingAssignment) {
          dispatch({
            type: 'UPDATE_ASSIGNMENT_SUBMISSIONS',
            payload: { id: existingAssignment.id, submissions: { [studentId]: { timestamp: new Date().toISOString() } } }
          });
        } else {
          dispatch({
            type: 'ADD_ASSIGNMENT',
            payload: {
              id: Date.now(),
              title: activityContent,
              subject: '활동',
              type: state.activityCheck?.type || '수행평가',
              dueDate: todayStr,
              submissions: { [studentId]: { timestamp: new Date().toISOString() } },
              total: students.length,
            }
          });
        }
      }
    }
  };

  const handlePointerLeave = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  // 과제 목록 역순 정렬 및 페이지네이션
  const sortedAssignments = [...assignments].sort((a, b) => b.id - a.id);
  const totalPages = Math.ceil(sortedAssignments.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayAssignments = sortedAssignments.slice(startIndex, startIndex + itemsPerPage);

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
          {isAdmin && isEditingActivity ? (
            <div className="activity-edit-mode">
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <select className="form-input" value={tempActivityType} onChange={e => setTempActivityType(e.target.value)} style={{ width: '120px' }}>
                  <option value="수행평가">수행평가</option>
                  <option value="과제">과제</option>
                </select>
                <input
                  type="text"
                  className="activity-input form-input"
                  value={tempActivityContent}
                  onChange={(e) => setTempActivityContent(e.target.value)}
                  placeholder="활동 내용을 입력하세요"
                  autoFocus
                  style={{ flex: 1 }}
                />
              </div>
              <div className="activity-edit-actions">
                <button className="activity-btn primary" onClick={() => {
                  dispatch({ type: 'UPDATE_ACTIVITY_CONTENT', payload: { content: tempActivityContent, type: tempActivityType } });

                  // 과제/수행평가 목록에도 자동 추가 (이미 있으면 무시)
                  const todayStr = new Date().toISOString().split('T')[0];
                  const existingAssignment = assignments.find(
                    a => a.title === tempActivityContent && a.dueDate === todayStr
                  );
                  if (!existingAssignment && tempActivityContent.trim() !== '') {
                    dispatch({
                      type: 'ADD_ASSIGNMENT',
                      payload: {
                        id: Date.now(),
                        title: tempActivityContent,
                        subject: '활동',
                        type: tempActivityType,
                        dueDate: todayStr,
                        submissions: {},
                        total: students.length,
                      }
                    });
                    showToast('과제/수행평가 목록에도 추가되었습니다.', 'success');
                  }

                  setIsEditingActivity(false);
                }}>저장</button>
                <button className="activity-btn secondary" onClick={() => {
                  setTempActivityContent(state.activityCheck?.content || '');
                  setTempActivityType(state.activityCheck?.type || '수행평가');
                  setIsEditingActivity(false);
                }}>취소</button>
              </div>
            </div>
          ) : (
            <div className="activity-view-mode">
              <div className="activity-text">
                <span className={`badge ${state.activityCheck?.type === '과제' ? 'badge-success' : 'badge-primary'}`}>{state.activityCheck?.type || '수행평가'}</span>
                <span className="activity-label" style={{ marginLeft: '0.5rem' }}>활동 내용:</span>
                <span className="activity-value">{state.activityCheck?.content || '활동 내용이 없습니다.'}</span>
              </div>
              {isAdmin && (
                <button className="activity-btn edit" onClick={() => {
                  setTempActivityContent('');
                  setTempActivityType('수행평가');
                  dispatch({ type: 'UPDATE_ACTIVITY_CHECK', payload: { content: '', type: '수행평가', completions: {} } });
                  setIsEditingActivity(true);
                }}>추가</button>
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
        {displayAssignments.length > 0 ? displayAssignments.map(a => {
          const total = a.total || students.length;
          // Calculate submitted count properly based on object or number
          const submittedCount = typeof a.submitted === 'number'
            ? a.submitted
            : Object.keys(a.submissions || {}).length;

          const pct = Math.round((submittedCount / total) * 100);
          const remaining = total - submittedCount;
          return (
            <div key={a.id} className="assignment-card clickable" onClick={() => setSelectedAssignment(a)}>
              <div className="assignment-icon" style={{ background: a.type === '수행평가' ? '#FFF4ED' : '#ECFDF5' }}>
                {a.type === '수행평가' ? '📋' : '📝'}
              </div>
              <div className="assignment-details">
                <div className="assignment-title">{a.title}</div>
                <div className="assignment-info" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', width: '100%' }}>
                  <span className={`badge ${a.type === '수행평가' ? 'badge-primary' : 'badge-success'}`}>{a.type}</span>
                  <span>{a.subject}</span>
                  <span>마감: {a.dueDate || a.due_date}</span>
                  {remaining > 0 && <span style={{ color: 'var(--danger)' }}>미제출 {remaining}명</span>}
                  {isAdmin && (
                    <button style={{ background: 'transparent', border: 'none', color: '#DC2626', fontSize: '0.8rem', cursor: 'pointer', marginLeft: 'auto', fontWeight: 600, display: 'flex', alignItems: 'center', height: '100%' }} onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('이 항목을 정말 삭제하시겠습니까?')) {
                        dispatch({ type: 'DELETE_ASSIGNMENT', payload: a.id });
                        showToast('삭제되었습니다.', 'success');
                      }
                    }}>🗑️ 삭제</button>
                  )}
                </div>
              </div>
              <div className="assignment-progress-bar">
                <div className="progress-bar">
                  <div className={`progress-fill ${pct >= 80 ? 'green' : pct >= 50 ? '' : 'red'}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
              <div className="assignment-percentage">{pct}%</div>
            </div>
          );
        }) : (
          <div className="empty-state" style={{ padding: '2rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-secondary)' }}>등록된 과제가 없습니다. 활동 완료 체크를 하면 자동으로 추가됩니다.</p>
          </div>
        )}
      </div>
      {totalPages > 1 && (
        <div className="pagination" style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem' }}>
          <button className="btn btn-sm" disabled={currentPage === 1} onClick={() => setCurrentPage(p => Math.max(1, p - 1))}>이전</button>
          <span style={{ fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center' }}>{currentPage} / {totalPages}</span>
          <button className="btn btn-sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}>다음</button>
        </div>
      )}

      {/* Submission Status Modal */}
      {selectedAssignment && (
        <div className="modal-overlay" onClick={() => setSelectedAssignment(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h3>📋 {selectedAssignment.title} 제출 현황</h3>
              <button className="close-btn" onClick={() => setSelectedAssignment(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="submission-stats" style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <div className="stat-box" style={{ flex: 1, padding: '1rem', background: '#ECFDF5', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                  <div style={{ color: '#059669', fontWeight: 800, fontSize: '1.5rem' }}>
                    {Object.keys(selectedAssignment.submissions || {}).length}명
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#047857' }}>제출완료</div>
                </div>
                <div className="stat-box" style={{ flex: 1, padding: '1rem', background: '#FEF2F2', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                  <div style={{ color: '#DC2626', fontWeight: 800, fontSize: '1.5rem' }}>
                    {students.length - Object.keys(selectedAssignment.submissions || {}).length}명
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#B91C1C' }}>미제출</div>
                </div>
              </div>

              <div className="submission-lists" style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
                <div style={{ flex: 1, padding: '1rem', background: '#F8FAFC', borderRadius: 'var(--radius-md)' }}>
                  <h4 style={{ marginBottom: '0.75rem', color: '#059669', borderBottom: '2px solid #D1FAE5', paddingBottom: '0.5rem' }}>✅ 제출자</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {students.filter(s => selectedAssignment.submissions?.[s.id]).map(s => (
                      <div key={s.id} className="badge" style={{ background: '#D1FAE5', color: '#065F46', padding: '0.4rem 0.75rem', fontSize: '0.875rem' }}>
                        {s.number}. {s.name}
                      </div>
                    ))}
                    {students.filter(s => selectedAssignment.submissions?.[s.id]).length === 0 && <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>제출자가 없습니다.</span>}
                  </div>
                </div>
                <div style={{ flex: 1, padding: '1rem', background: '#F8FAFC', borderRadius: 'var(--radius-md)' }}>
                  <h4 style={{ marginBottom: '0.75rem', color: '#DC2626', borderBottom: '2px solid #FEE2E2', paddingBottom: '0.5rem' }}>❌ 미제출자</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {students.filter(s => !selectedAssignment.submissions?.[s.id]).map(s => (
                      <div key={s.id} className="badge" style={{ background: '#FEE2E2', color: '#991B1B', padding: '0.4rem 0.75rem', fontSize: '0.875rem' }}>
                        {s.number}. {s.name}
                      </div>
                    ))}
                    {students.filter(s => !selectedAssignment.submissions?.[s.id]).length === 0 && <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>미제출자가 없습니다.</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
