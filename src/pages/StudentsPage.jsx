import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getAvatarColor, getInitials } from '../utils/helpers';
import { COUNSELING_RECORDS } from '../data/mockData';
import './StudentsPage.css';

export default function StudentsPage() {
  const { state, dispatch, showToast, updatePoints } = useApp();
  const { students, isAdmin } = state;
  const [search, setSearch] = useState('');
  const [view, setView] = useState('card'); // card | table | seating | points
  const [pointsView, setPointsView] = useState('individual'); // individual | group
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editNameValue, setEditNameValue] = useState('');

  const filtered = students.filter(s => s.name.includes(search) || String(s.number).includes(search));
  const sorted = [...students].sort((a, b) => b.points - a.points);

  const handleAddPoints = (id, currentPoints, amount) => {
    updatePoints(id, currentPoints, amount);
    showToast(`${amount > 0 ? '+' : ''}${amount}점이 부여되었습니다.`, 'success');
  };

  const groupPoints = [1, 2, 3, 4, 5, 6].map(groupId => {
    const groupStudents = students.filter(s => s.group === groupId);
    const totalPoints = groupStudents.reduce((sum, s) => sum + (s.points || 0), 0);
    return { groupId, totalPoints, students: groupStudents };
  }).sort((a, b) => b.totalPoints - a.totalPoints);

  // Seating grid: 5 rows x 7 cols
  const seatGrid = [
    [1,2,3,null,4,5,6],[7,8,9,null,10,11,12],
    [13,14,15,null,16,17,18],[19,20,21,null,22,23,24],
    [25,26,27,null,28,null,null]
  ];

  return (
    <div className="students-page">
      {/* Toolbar */}
      <div className="students-toolbar">
        <div className="search-wrapper">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input className="search-input" placeholder="학생 이름 또는 번호 검색..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="view-toggle">
          {[{v:'card',icon:'▦'},{v:'table',icon:'☰'},{v:'seating',icon:'⊞'},{v:'points',icon:'⭐'}].map(b => (
            <button key={b.v} className={`view-toggle-btn ${view === b.v ? 'active' : ''}`} onClick={() => setView(b.v)}>{b.icon}</button>
          ))}
        </div>
      </div>

      {/* Card View */}
      {view === 'card' && (
        <div className="students-grid">
          {filtered.map(s => (
            <div key={s.id} className="student-card" onClick={() => setSelectedStudent(s)}>
              <div className="student-card-header">
                <div className={`avatar ${getAvatarColor(s.id)}`}>{getInitials(s.name)}</div>
                <div>
                  <div className="student-number">{s.number}번</div>
                  <div className="student-name-main">{s.name}</div>
                </div>
              </div>
              <div className="student-card-body">
                <div className="student-meta"><span>{s.gender === 'M' ? '👦' : '👧'} {s.birthday.slice(5)}</span></div>
                {s.allergies && <div className="student-meta allergy">⚠️ {s.allergies}</div>}
                {s.healthNotes && <div className="student-meta">🏥 {s.healthNotes}</div>}
              </div>
              <div className="student-card-footer">
                <span className="student-points">⭐ {s.points}점</span>
                {isAdmin && (
                  <div className="student-actions">
                    <button className="point-add plus" onClick={e => { e.stopPropagation(); handleAddPoints(s.id, s.points, 1); }}>+</button>
                    <button className="point-add minus" onClick={e => { e.stopPropagation(); handleAddPoints(s.id, s.points, -1); }}>-</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Table View */}
      {view === 'table' && (
        <div className="table-container">
          <table>
            <thead><tr><th>번호</th><th>이름</th><th>성별</th><th>생일</th><th>알레르기</th><th>건강</th><th>포인트</th></tr></thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id} onClick={() => setSelectedStudent(s)} style={{cursor:'pointer'}}>
                  <td>{s.number}</td>
                  <td><div style={{display:'flex',alignItems:'center',gap:'0.5rem'}}><div className={`avatar sm ${getAvatarColor(s.id)}`}>{getInitials(s.name)}</div>{s.name}</div></td>
                  <td>{s.gender === 'M' ? '남' : '여'}</td>
                  <td>{s.birthday.slice(5)}</td>
                  <td>{s.allergies || '-'}</td>
                  <td>{s.healthNotes || '-'}</td>
                  <td><span className="student-points">⭐ {s.points}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Seating Chart */}
      {view === 'seating' && (
        <div className="seating-container">
          <div className="seating-header"><h3>📐 자리 배치도</h3></div>
          <div className="seating-board">
            <div className="teacher-desk">교탁</div>
            <div className="seating-grid">
              {seatGrid.map((row, ri) =>
                row.map((seatId, ci) => {
                  if (seatId === null) return <div key={`${ri}-${ci}`} className="seat empty-aisle" />;
                  const s = students.find(st => st.number === seatId);
                  if (!s) return <div key={`${ri}-${ci}`} className="seat" />;
                  return (
                    <div key={s.id} className="seat occupied" onClick={() => setSelectedStudent(s)}>
                      <div className="seat-name">{s.name}</div>
                      <div className="seat-number">{s.number}번</div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* Points Leaderboard */}
      {view === 'points' && (
        <div className="points-section">
          <div className="points-header" style={{ display: 'flex', justifyItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
            <h3 style={{ margin: 0 }}>🏆 칭찬 포인트 랭킹</h3>
            <div className="points-tabs" style={{ display: 'flex', gap: '0.5rem' }}>
              <button className={`admin-btn ${pointsView === 'individual' ? 'active' : ''}`} style={pointsView === 'individual' ? {background:'var(--primary)', color:'white', borderColor:'var(--primary)'} : {}} onClick={() => setPointsView('individual')}>개인별</button>
              <button className={`admin-btn ${pointsView === 'group' ? 'active' : ''}`} style={pointsView === 'group' ? {background:'var(--primary)', color:'white', borderColor:'var(--primary)'} : {}} onClick={() => setPointsView('group')}>모둠별</button>
            </div>
          </div>
          
          {pointsView === 'individual' ? (
            <div className="points-leaderboard">
              {sorted.map((s, i) => (
                <div key={s.id} className="points-row glass-card" style={{ background: 'var(--bg-card)', backdropFilter: 'blur(12px)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: 'var(--shadow-sm)' }}>
                  <div className={`points-rank ${i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : ''}`}>{i+1}</div>
                  <div className={`avatar sm ${getAvatarColor(s.id)}`}>{getInitials(s.name)}</div>
                  <div className="points-student-name" style={{ flex: 1, fontWeight: 600 }}>
                    {s.name} <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginLeft: '0.5rem', fontWeight: 500 }}>{s.group}모둠</span>
                  </div>
                  <div className="points-score" style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--primary)' }}>⭐ {s.points}</div>
                  {isAdmin && (
                    <div className="points-actions" style={{ display: 'flex', gap: '0.25rem' }}>
                      <button className="btn btn-primary" onClick={() => handleAddPoints(s.id, s.points, 5)}>+5점</button>
                      <button className="btn" style={{background:'var(--success)',color:'white'}} onClick={() => handleAddPoints(s.id, s.points, 10)}>+10점</button>
                      <button className="btn btn-danger" onClick={() => handleAddPoints(s.id, s.points, -5)}>-5점</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="points-leaderboard group-leaderboard">
              {groupPoints.map((g, i) => (
                <div key={g.groupId} className="points-row glass-card" style={{ background: 'var(--bg-card)', backdropFilter: 'blur(12px)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: 'var(--shadow-md)' }}>
                  <div className={`points-rank ${i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : ''}`} style={{ fontSize: '1.5rem', width: '36px', textAlign: 'center' }}>{i+1}</div>
                  <div className="group-avatar" style={{width:'50px', height:'50px', borderRadius:'var(--radius-full)', background:'var(--primary-50)', color:'var(--primary-dark)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:'1.4rem'}}>{g.groupId}</div>
                  <div className="points-student-name" style={{ flex: 1 }}>
                    <div style={{fontWeight: 800, fontSize: '1.1rem', marginBottom: '4px', color: 'var(--text-primary)'}}>{g.groupId}모둠</div>
                    <div style={{fontSize:'0.8125rem', color:'var(--text-secondary)'}}>{g.students.map(s=>s.name).join(', ')}</div>
                  </div>
                  <div className="points-score" style={{fontWeight: 800, fontSize: '1.5rem', color: 'var(--primary-dark)'}}>⭐ {g.totalPoints}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Student Detail Modal */}
      {selectedStudent && (
        <div className="modal-overlay" onClick={() => { setSelectedStudent(null); setIsEditingName(false); }}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">학생 정보</h3>
              <button className="modal-close" onClick={() => { setSelectedStudent(null); setIsEditingName(false); }}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="student-detail-header">
                <div className={`avatar xl ${getAvatarColor(selectedStudent.id)}`}>{getInitials(selectedStudent.name)}</div>
                <div className="student-detail-info">
                  <div className="student-name-edit-wrapper">
                    {isEditingName ? (
                      <div className="edit-name-form">
                        <input 
                          type="text" 
                          className="form-input" 
                          value={editNameValue} 
                          onChange={(e) => setEditNameValue(e.target.value)} 
                          autoFocus
                          style={{width: '120px', padding: '0.25rem 0.5rem', minHeight: '30px'}}
                        />
                        <button className="btn btn-primary btn-sm" onClick={() => {
                          if (editNameValue.trim()) {
                            dispatch({ type: 'UPDATE_STUDENT', payload: { id: selectedStudent.id, name: editNameValue.trim() } });
                            setSelectedStudent({ ...selectedStudent, name: editNameValue.trim() });
                            showToast('이름이 수정되었습니다.', 'success');
                          }
                          setIsEditingName(false);
                        }}>저장</button>
                        <button className="btn btn-secondary btn-sm" onClick={() => setIsEditingName(false)}>취소</button>
                      </div>
                    ) : (
                      <div className="name-display" style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                        <h3>{selectedStudent.name}</h3>
                        <button className="edit-name-btn" onClick={() => {
                          setEditNameValue(selectedStudent.name);
                          setIsEditingName(true);
                        }} style={{background:'transparent', border:'none', cursor:'pointer', color:'var(--text-muted)', fontSize:'1.2rem'}} title="이름 수정">✎</button>
                      </div>
                    )}
                  </div>
                  <p>{selectedStudent.number}번 · {selectedStudent.gender === 'M' ? '남학생' : '여학생'} · 생일: {selectedStudent.birthday}</p>
                </div>
              </div>
              <div className="student-detail-stats">
                <div className="detail-stat"><div className="detail-stat-value">⭐ {selectedStudent.points}</div><div className="detail-stat-label">포인트</div></div>
                <div className="detail-stat"><div className="detail-stat-value">{selectedStudent.allergies || '없음'}</div><div className="detail-stat-label">알레르기</div></div>
                <div className="detail-stat"><div className="detail-stat-value">{selectedStudent.healthNotes || '없음'}</div><div className="detail-stat-label">건강정보</div></div>
              </div>
              <div style={{marginBottom:'0.75rem'}}>
                <strong style={{fontSize:'0.875rem'}}>📞 학부모 연락처:</strong>
                <span style={{marginLeft:'0.5rem',fontSize:'0.875rem'}}>{selectedStudent.parentPhone}</span>
              </div>
              {COUNSELING_RECORDS[selectedStudent.id] && (
                <div>
                  <strong style={{fontSize:'0.875rem'}}>📋 상담 기록</strong>
                  <div className="counseling-list" style={{marginTop:'0.5rem'}}>
                    {COUNSELING_RECORDS[selectedStudent.id].map((c, i) => (
                      <div key={i} className="counseling-item">
                        <div className="counseling-date">{c.date} · {c.category}</div>
                        <div className="counseling-content">{c.content}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
