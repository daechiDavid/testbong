/* eslint-disable react-hooks/purity */
import { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import './LearningPage.css';

export default function LearningPage() {
  const { state, showToast, addAssignment, updateAssignmentSubmissions, deleteAssignment } = useApp();
  const { students, assignments, isAdmin } = state;

  const currentActivity = [...assignments].filter(a => a.subject === '활동').sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))[0];

  const [isEditingActivity, setIsEditingActivity] = useState(false);
  const [tempActivityContent, setTempActivityContent] = useState('');
  const [tempActivityType, setTempActivityType] = useState('수행평가');
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
    if (!currentActivity) return;
    timerRef.current = setTimeout(() => {
      if (currentActivity.submissions?.[studentId]) {
        // 체크 해제
        const newSubmissions = { ...currentActivity.submissions };
        delete newSubmissions[studentId];
        updateAssignmentSubmissions(currentActivity.id, { [studentId]: null }); // null을 통해 서버에서 삭제 처리하게끔 하는 것은 아니지만 객체 덮어쓰기이므로 로컬엔 반영됨. 단, DataConnect에서 부분 삭제가 어려우면, 아예 새 객체로 통째로 갈아끼우거나 여기서는 프론트엔드 상태 반영만 함.
        // Wait, updateAssignmentSubmissions merges submissions. If we want to delete, we need a way to pass the whole object.
        // Let's pass undefined or handle it in AppContext.
      }
      timerRef.current = null;
    }, 500);
  };

  const handlePointerUp = (studentId) => {
    if (!currentActivity) return;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
      if (!currentActivity.submissions?.[studentId]) {
        // 체크 (제출 처리)
        updateAssignmentSubmissions(currentActivity.id, { [studentId]: { timestamp: new Date().toISOString() } });
      }
    }
  };

  const handlePointerLeave = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  // 과제 목록 최근 항목이 위로 오도록 역순 정렬 및 페이지네이션
  const sortedAssignments = [...assignments].reverse();
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
                  if (tempActivityContent.trim() !== '') {
                    addAssignment({
                      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
                      title: tempActivityContent,
                      subject: '활동',
                      type: tempActivityType,
                      dueDate: new Date().toISOString().split('T')[0],
                      submissions: {},
                      total: students.length,
                    });
                    showToast('새로운 활동이 추가되었습니다.', 'success');
                  }
                  setIsEditingActivity(false);
                }}>저장</button>
                <button className="activity-btn secondary" onClick={() => {
                  setTempActivityContent('');
                  setTempActivityType('수행평가');
                  setIsEditingActivity(false);
                }}>취소</button>
              </div>
            </div>
          ) : (
            <div className="activity-view-mode">
              <div className="activity-text">
                {currentActivity ? (
                  <>
                    <span className={`badge ${currentActivity.type === '과제' ? 'badge-success' : 'badge-primary'}`}>{currentActivity.type || '수행평가'}</span>
                    <span className="activity-label" style={{ marginLeft: '0.5rem' }}>활동 내용:</span>
                    <span className="activity-value">{currentActivity.title}</span>
                  </>
                ) : (
                  <span className="activity-value">현재 등록된 활동이 없습니다. 새로 추가해 주세요.</span>
                )}
              </div>
              {isAdmin && (
                <button className="activity-btn edit" onClick={() => {
                  setTempActivityContent('');
                  setTempActivityType('수행평가');
                  setIsEditingActivity(true);
                }}>추가</button>
              )}
            </div>
          )}
        </div>

        <div className="activity-students-grid">
          {students.map(student => {
            const isCompleted = !!currentActivity?.submissions?.[student.id];
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
            <div key={a.id} className="assignment-card clickable" onClick={() => setSelectedAssignment(selectedAssignment?.id === a.id ? null : a)} style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', width: '100%', alignItems: 'center', gap: '1rem' }}>
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
                  </div>
                </div>
                <div className="assignment-progress-bar">
                  <div className="progress-bar">
                    <div className={`progress-fill ${pct >= 80 ? 'green' : pct >= 50 ? '' : 'red'}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
                <div className="assignment-percentage">{pct}%</div>
                {isAdmin && (
                  <button className="assignment-delete-btn" onClick={(e) => {
                    e.stopPropagation();
                    if (confirm('이 항목을 정말 삭제하시겠습니까?')) {
                      deleteAssignment(a.id);
                      showToast('삭제되었습니다.', 'success');
                    }
                  }} title="삭제">🗑️</button>
                )}
              </div>

              {selectedAssignment?.id === a.id && (
                <div className="assignment-students-inline" style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-light)', width: '100%' }}>
                  <div style={{ marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem', color: '#059669' }}>✅ 제출자</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                    {students.filter(s => a.submissions?.[s.id]).map(s => (
                      <button key={s.id} className="badge" style={{ border: 'none', background: '#D1FAE5', color: '#065F46', padding: '0.4rem 0.75rem', fontSize: '0.875rem', cursor: 'default' }}>
                        {s.number}. {s.name}
                      </button>
                    ))}
                    {students.filter(s => a.submissions?.[s.id]).length === 0 && <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>제출자가 없습니다.</span>}
                  </div>

                  <div style={{ marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem', color: '#DC2626' }}>❌ 미제출자</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {students.filter(s => !a.submissions?.[s.id]).map(s => (
                      <button key={s.id} className="badge" style={{ border: 'none', background: '#FEE2E2', color: '#991B1B', padding: '0.4rem 0.75rem', fontSize: '0.875rem', cursor: 'default' }}>
                        {s.number}. {s.name}
                      </button>
                    ))}
                    {students.filter(s => !a.submissions?.[s.id]).length === 0 && <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>미제출자가 없습니다.</span>}
                  </div>
                </div>
              )}
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

    </div>
  );
}
