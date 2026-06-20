import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getAvatarColor, getInitials } from '../utils/helpers';
import * as XLSX from 'xlsx';
import './StudentsPage.css';

export default function StudentsPage() {
  const { state, dispatch, showToast, updatePoints, resetPoints, updateStudent, bulkUpdateStudents, addStudentRecord, deleteStudentRecord } = useApp();
  const { students, isAdmin, studentRecords, assignments } = state;
  const [activeTab, setActiveTab] = useState('list'); // 'list', 'behavior', 'evaluation'
  const [search, setSearch] = useState('');
  const [view, setView] = useState('card');
  const [pointsView, setPointsView] = useState('individual');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editNameValue, setEditNameValue] = useState('');
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkNames, setBulkNames] = useState('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [draggedSeat, setDraggedSeat] = useState(null);
  const [draggedGroupStudent, setDraggedGroupStudent] = useState(null);

  // 학생 상세 편집 상태
  const [editGender, setEditGender] = useState('');
  const [editBirthday, setEditBirthday] = useState('');
  const [editParentPhone, setEditParentPhone] = useState('');
  const [newRecordType, setNewRecordType] = useState('observation');
  const [newRecordContent, setNewRecordContent] = useState('');
  const [newRecordCategory, setNewRecordCategory] = useState('생활');

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

  const seatingList = [...students].sort((a, b) => {
    const aIdx = a.seatIndex !== undefined ? a.seatIndex : a.number;
    const bIdx = b.seatIndex !== undefined ? b.seatIndex : b.number;
    return aIdx - bIdx;
  });

  // --- 자리 배치도 DnD ---
  const handleDragStartSeat = (e, student) => {
    if (!isAdmin) return;
    setDraggedSeat(student);
    e.dataTransfer.effectAllowed = 'move';
    e.target.style.opacity = '0.5';
  };
  const handleDragEndSeat = (e) => {
    if (!isAdmin) return;
    e.target.style.opacity = '1';
    setDraggedSeat(null);
  };
  const handleDragOverSeat = (e) => {
    if (!isAdmin) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };
  const handleDropSeat = (e, targetStudent) => {
    if (!isAdmin) return;
    e.preventDefault();
    if (!draggedSeat || draggedSeat.id === targetStudent.id) return;
    const dragIndex = draggedSeat.seatIndex !== undefined ? draggedSeat.seatIndex : draggedSeat.number;
    const targetIndex = targetStudent.seatIndex !== undefined ? targetStudent.seatIndex : targetStudent.number;
    bulkUpdateStudents([
      { id: draggedSeat.id, seatIndex: targetIndex },
      { id: targetStudent.id, seatIndex: dragIndex }
    ]);
  };

  // --- 팀 설정 DnD ---
  const handleDragStartTeam = (e, student) => {
    if (!isAdmin) return;
    setDraggedGroupStudent(student);
    e.dataTransfer.effectAllowed = 'move';
    e.target.style.opacity = '0.5';
  };
  const handleDragEndTeam = (e) => {
    if (!isAdmin) return;
    e.target.style.opacity = '1';
    setDraggedGroupStudent(null);
  };
  const handleDragOverTeam = (e) => {
    if (!isAdmin) return;
    e.preventDefault();
    e.currentTarget.style.borderColor = 'var(--primary)';
    e.currentTarget.style.background = 'var(--primary-50)';
  };
  const handleDragLeaveTeam = (e) => {
    if (!isAdmin) return;
    e.currentTarget.style.borderColor = 'var(--glass-border)';
    e.currentTarget.style.background = 'var(--bg-card)';
  };
  const handleDropTeam = (e, targetGroupId) => {
    if (!isAdmin) return;
    e.preventDefault();
    e.currentTarget.style.borderColor = 'var(--glass-border)';
    e.currentTarget.style.background = 'var(--bg-card)';
    if (!draggedGroupStudent || draggedGroupStudent.group === targetGroupId) return;
    updateStudent({ id: draggedGroupStudent.id, group: targetGroupId });
  };

  const handleSelectStudent = (s) => {
    setSelectedStudent(s);
    setEditGender(s.gender || 'M');
    setEditBirthday(s.birthday || '');
    setEditParentPhone(s.parentPhone || '');
    setIsEditingName(false);
    setNewRecordContent('');
  };

  const handleSaveStudentInfo = () => {
    updateStudent({
      id: selectedStudent.id,
      gender: editGender,
      birthday: editBirthday,
      parentPhone: editParentPhone,
    });
    setSelectedStudent({ ...selectedStudent, gender: editGender, birthday: editBirthday, parentPhone: editParentPhone });
    showToast('학생 정보가 수정되었습니다.', 'success');
  };

  const handleResetPoints = () => {
    if (!window.confirm(`${selectedStudent.name} 학생의 포인트를 초기화하시겠습니까?`)) return;
    resetPoints(selectedStudent.id);
    setSelectedStudent({ ...selectedStudent, points: 0 });
    showToast('포인트가 초기화되었습니다.', 'success');
  };

  const handleAddRecord = () => {
    if (!newRecordContent.trim()) {
      showToast('내용을 입력해주세요.', 'error');
      return;
    }
    addStudentRecord(selectedStudent.id, newRecordType, newRecordContent, newRecordCategory);
    setNewRecordContent('');
  };

  const handleBulkUpdate = () => {
    const lines = bulkNames.split('\n').map(l => l.trim()).filter(l => l);
    if (lines.length === 0) { showToast('입력된 내용이 없습니다.', 'error'); return; }
    
    // 기존 학생 목록을 보존하되, 입력된 라인 수에 맞춰서 추가/수정/삭제 처리
    const newStudents = lines.map((line, i) => {
      const parts = line.split(/[\t,]+/).map(p => p.trim());
      const existing = students.find(s => s.number === i + 1);
      
      let gender = 'M';
      if (parts[1]) {
        const g = parts[1].toUpperCase();
        if (g === 'F' || g === '여') gender = 'F';
      }
      
      return {
        ...existing,
        id: existing ? existing.id : crypto.randomUUID(),
        number: i + 1,
        name: parts[0] || `학생${i+1}`,
        gender: gender,
        birthday: parts[2] || (existing ? existing.birthday : ''),
        points: existing ? existing.points : 0,
        group: existing ? existing.group : Math.ceil((i+1)/4),
      };
    });

    dispatch({ type: 'SET_STUDENTS', payload: newStudents });
    bulkUpdateStudents(newStudents);
    showToast(`총 ${newStudents.length}명으로 명단이 갱신되었습니다.`, 'success');
    setShowBulkModal(false);
    setBulkNames('');
  };

  const handleDownloadTemplate = () => {
    const templateData = [
      { 이름: '홍길동', 성별: 'M', 생일: '2014-01-01', 연락처: '010-0000-0000' }
    ];
    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "학생명단");
    XLSX.writeFile(wb, "학생명단양식.xlsx");
  };

  const handleExcelUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws);
      
      if (data.length === 0) {
        showToast('데이터가 없습니다.', 'error');
        return;
      }

      const newStudents = data.map((row, i) => {
        const existing = students.find(s => s.number === i + 1);
        let gender = 'M';
        if (row['성별']) {
          const g = String(row['성별']).toUpperCase();
          if (g === 'F' || g === '여') gender = 'F';
        }
        return {
          ...existing,
          id: existing ? existing.id : crypto.randomUUID(),
          number: i + 1,
          name: row['이름'] || `학생${i+1}`,
          gender: gender,
          birthday: row['생일'] || (existing ? existing.birthday : ''),
          parentPhone: row['연락처'] || (existing ? existing.parentPhone : ''),
          points: existing ? existing.points : 0,
          group: existing ? existing.group : Math.ceil((i+1)/4),
        };
      });
      dispatch({ type: 'SET_STUDENTS', payload: newStudents });
      bulkUpdateStudents(newStudents);
      showToast(`총 ${newStudents.length}명으로 명단이 갱신되었습니다.`, 'success');
    };
    reader.readAsBinaryString(file);
    e.target.value = null; // reset input
  };

  const handleGenerateAI = async (student) => {
    const recs = studentRecords[student.id] || [];
    const evals = assignments.filter(a => a.submissions?.[student.id]).map(a => ({
      title: a.title,
      grade: a.submissions[student.id].grade
    }));

    const studentData = {
      name: student.name,
      gender: student.gender,
      points: student.points || 0,
      records: recs,
      evaluations: evals
    };

    try {
      setIsGeneratingAi(true);
      
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ studentData })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || '의견 생성 실패');
      }

      const data = await res.json();
      
      updateStudent({ id: student.id, aiSummary: data.summary });
      
      showToast('AI가 종합의견을 생성했습니다.', 'success');
    } catch (err) {
      showToast('AI 생성 중 오류가 발생했습니다: ' + err.message, 'error');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleEvaluate = (assignmentId, studentId, grade) => {
    dispatch({
      type: 'EVALUATE_ASSIGNMENT',
      payload: { id: assignmentId, studentId, grade }
    });
    showToast('평가가 저장되었습니다.', 'success');
  };

  const records = selectedStudent ? (studentRecords[selectedStudent.id] || []) : [];

  return (
    <div className="students-page">
      {/* Top Tabs */}
      <div className="students-tabs">
        <button className={`tab-btn ${activeTab === 'list' ? 'active' : ''}`} onClick={() => setActiveTab('list')}>👥 학생 목록</button>
        <button className={`tab-btn ${activeTab === 'behavior' ? 'active' : ''}`} onClick={() => setActiveTab('behavior')}>🌱 행동발달</button>
        <button className={`tab-btn ${activeTab === 'evaluation' ? 'active' : ''}`} onClick={() => setActiveTab('evaluation')}>📝 학습평가</button>
      </div>

      {/* Tab: List */}
      {activeTab === 'list' && (
        <>
          <div className="students-toolbar">
            <div className="search-wrapper">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input className="search-input" placeholder="학생 이름 또는 번호 검색..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div style={{display:'flex', gap:'0.5rem', alignItems:'center'}}>
              {isAdmin && (
                <div style={{display:'flex', gap:'0.5rem', alignItems:'center'}}>
                  <button className="btn btn-secondary btn-sm" onClick={handleDownloadTemplate}>양식 다운로드</button>
                  <label className="btn btn-secondary btn-sm" style={{cursor:'pointer', margin:0}}>
                    엑셀 업로드
                    <input type="file" accept=".xlsx, .xls" style={{display:'none'}} onChange={handleExcelUpload} />
                  </label>
                  <button className="btn btn-primary btn-sm" onClick={() => {
                    const existingNames = students.map(s => `${s.name}\t${s.gender||''}\t${s.birthday||''}`).join('\n');
                    setBulkNames(existingNames);
                    setShowBulkModal(true);
                  }}>📝 일괄 수정</button>
                </div>
              )}
              <div className="view-toggle">
                {[{v:'card',icon:'▦'},{v:'table',icon:'☰'},{v:'seating',icon:'⊞'},{v:'points',icon:'⭐'}].map(b => (
                  <button key={b.v} className={`view-toggle-btn ${view === b.v ? 'active' : ''}`} onClick={() => setView(b.v)}>{b.icon}</button>
                ))}
              </div>
            </div>
          </div>

      {/* Card View */}
      {view === 'card' && (
        <div className="students-grid">
          {filtered.map(s => (
            <div key={s.id} className="student-card" onClick={() => handleSelectStudent(s)}>
              <div className="student-card-header">
                <div className={`avatar ${getAvatarColor(s.id)}`}>{getInitials(s.name)}</div>
                <div>
                  <div className="student-number">{s.number}번</div>
                  <div className="student-name-main">{s.name}</div>
                </div>
              </div>
              <div className="student-card-body">
                <div className="student-meta"><span>{s.gender === 'M' ? '👦' : '👧'} {s.birthday?.slice(5) || ''}</span></div>
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
                <tr key={s.id} onClick={() => handleSelectStudent(s)} style={{cursor:'pointer'}}>
                  <td>{s.number}</td>
                  <td><div style={{display:'flex',alignItems:'center',gap:'0.5rem'}}><div className={`avatar sm ${getAvatarColor(s.id)}`}>{getInitials(s.name)}</div>{s.name}</div></td>
                  <td>{s.gender === 'M' ? '남' : '여'}</td>
                  <td>{s.birthday?.slice(5) || '-'}</td>
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
          <div className="seating-header">
            <h3>📐 자리 배치도</h3>
            {isAdmin && <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginLeft: '1rem' }}>💡 이름표를 드래그 앤 드롭하여 자리를 바꿀 수 있습니다.</span>}
          </div>
          <div className="seating-board">
            <div className="teacher-desk">교탁</div>
            <div className="seating-grid-dynamic">
              {seatingList.map((s) => (
                <div 
                  key={s.id} 
                  className="seat occupied" 
                  draggable={isAdmin}
                  onDragStart={(e) => handleDragStartSeat(e, s)}
                  onDragEnd={handleDragEndSeat}
                  onDragOver={handleDragOverSeat}
                  onDrop={(e) => handleDropSeat(e, s)}
                  onClick={() => handleSelectStudent(s)}
                  style={{ cursor: isAdmin ? 'grab' : 'pointer' }}
                >
                  <div className="seat-name">{s.name}</div>
                  <div className="seat-number">{s.number}번</div>
                </div>
              ))}
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
              <button className={`admin-btn ${pointsView === 'group' ? 'active' : ''}`} style={pointsView === 'group' ? {background:'var(--primary)', color:'white', borderColor:'var(--primary)'} : {}} onClick={() => setPointsView('group')}>팀별</button>
            </div>
          </div>
          
          {pointsView === 'individual' ? (
            <div className="points-leaderboard">
              {sorted.map((s, i) => (
                <div key={s.id} className="points-row glass-card" style={{ background: 'var(--bg-card)', backdropFilter: 'blur(12px)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: 'var(--shadow-sm)' }}>
                  <div className={`points-rank ${i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : ''}`}>{i+1}</div>
                  <div className={`avatar sm ${getAvatarColor(s.id)}`}>{getInitials(s.name)}</div>
                  <div className="points-student-name" style={{ flex: 1, fontWeight: 600 }}>
                    {s.name} <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginLeft: '0.5rem', fontWeight: 500 }}>{s.group}팀</span>
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
              <div style={{ marginBottom: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {isAdmin ? '💡 학생 이름표를 드래그하여 다른 팀으로 옮겨보세요.' : ''}
              </div>
              {groupPoints.map((g, i) => (
                <div 
                  key={g.groupId} 
                  className="points-row glass-card group-card-dnd" 
                  onDragOver={handleDragOverTeam}
                  onDragLeave={handleDragLeaveTeam}
                  onDrop={(e) => handleDropTeam(e, g.groupId)}
                  style={{ background: 'var(--bg-card)', backdropFilter: 'blur(12px)', border: '2px solid var(--glass-border)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'flex-start', gap: '1.5rem', boxShadow: 'var(--shadow-md)', transition: 'all 0.2s' }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                    <div className={`points-rank ${i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : ''}`} style={{ fontSize: '1.2rem', width: '30px', height: '30px', textAlign: 'center' }}>{i+1}</div>
                    <div className="group-avatar" style={{width:'40px', height:'40px', borderRadius:'var(--radius-full)', background:'var(--primary-50)', color:'var(--primary-dark)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:'1.2rem'}}>{g.groupId}</div>
                    <div className="points-score" style={{fontWeight: 800, fontSize: '1.1rem', color: 'var(--primary-dark)'}}>⭐ {g.totalPoints}</div>
                  </div>
                  <div className="points-student-name" style={{ flex: 1 }}>
                    <div style={{fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.75rem', color: 'var(--text-primary)'}}>{g.groupId}팀</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {g.students.map(s => (
                        <div 
                          key={s.id} 
                          className="team-student-pill"
                          draggable={isAdmin}
                          onDragStart={(e) => handleDragStartTeam(e, s)}
                          onDragEnd={handleDragEndTeam}
                          style={{ padding: '0.4rem 0.75rem', background: 'var(--gray-50)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-xl)', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: isAdmin ? 'grab' : 'default', transition: 'all 0.2s' }}
                        >
                          <div className={`avatar sm ${getAvatarColor(s.id)}`} style={{ width: '20px', height: '20px', fontSize: '0.6rem' }}>{getInitials(s.name)}</div>
                          {s.name}
                        </div>
                      ))}
                      {g.students.length === 0 && <span style={{fontSize:'0.85rem', color:'var(--text-muted)'}}>편성된 학생이 없습니다. 드래그하여 추가하세요.</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      </>
      )}

      {/* Tab: Behavior */}
      {activeTab === 'behavior' && (
        <div className="behavior-tab">
          <div className="behavior-grid" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {students.map(s => {
              const recs = studentRecords[s.id] || [];
              return (
                <div key={s.id} className="card" style={{ display: 'flex', gap: '1.5rem', padding: '1.5rem', alignItems: 'stretch' }}>
                  
                  {/* Left: Student Info */}
                  <div style={{ width: '160px', flexShrink: 0, textAlign: 'center', borderRight: '1px solid var(--border-light)', paddingRight: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div className={`avatar xl ${getAvatarColor(s.id)}`} style={{ margin: '0 auto 0.75rem auto' }}>{getInitials(s.name)}</div>
                    <h3 style={{ margin: '0 0 0.5rem 0' }}>{s.number}. {s.name}</h3>
                    {isAdmin && (
                      <button className="btn btn-sm btn-primary" onClick={() => handleGenerateAI(s)} disabled={isGeneratingAi} style={{ marginTop: '0.5rem', width: '100%', background: 'var(--primary-dark)' }}>
                        {isGeneratingAi ? '생성 중...' : '✨ AI 생성'}
                      </button>
                    )}
                    {isAdmin && (
                      <button className="btn btn-sm btn-secondary" onClick={() => handleSelectStudent(s)} style={{ marginTop: '0.5rem', width: '100%' }}>
                        기록 추가
                      </button>
                    )}
                  </div>

                  {/* Middle: Cumulative Records */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h4 style={{ marginBottom: '0.5rem', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between' }}>
                      <span>누적 기록</span>
                      <span className="badge">{recs.length}건</span>
                    </h4>
                    <div style={{ flex: 1, background: 'var(--gray-50)', padding: '1rem', borderRadius: 'var(--radius-md)', maxHeight: '200px', overflowY: 'auto' }}>
                      {recs.length > 0 ? (
                        <ul style={{ paddingLeft: '1.25rem', margin: 0, fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          {recs.map((r, i) => (
                            <li key={i}>
                              <strong style={{ color: 'var(--primary)' }}>[{r.date}]</strong> {r.content}
                              {isAdmin && (
                                <button style={{background:'transparent', border:'none', color:'#DC2626', fontSize:'0.75rem', cursor:'pointer', marginLeft:'0.5rem', fontWeight:600}} onClick={() => {
                                  if (confirm('이 기록을 삭제하시겠습니까?')) {
                                    deleteStudentRecord(s.id, r.id);
                                  }
                                }}>🗑️</button>
                              )}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="empty-state" style={{ minHeight: '100px', padding: 0 }}>기록이 없습니다.</div>
                      )}
                    </div>
                  </div>

                  {/* Right: AI Summary */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h4 style={{ marginBottom: '0.5rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      ✨ 종합의견
                    </h4>
                    <div style={{ flex: 1, background: 'var(--primary-50)', border: '1px solid var(--primary-100)', padding: '1rem', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', lineHeight: '1.6', overflowY: 'auto', maxHeight: '200px' }}>
                      {s.aiSummary ? (
                        <div style={{ whiteSpace: 'pre-wrap', color: 'var(--text-primary)' }}>{s.aiSummary}</div>
                      ) : (
                        <div className="empty-state" style={{ minHeight: '100px', padding: 0, opacity: 0.7 }}>
                          AI 생성 버튼을 눌러 종합의견을 작성해보세요.
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab: Evaluation */}
      {activeTab === 'evaluation' && (
        <div className="evaluation-tab">
          {assignments.length === 0 ? (
            <div className="empty-state">
              <p>등록된 과제 및 수행평가가 없습니다.</p>
            </div>
          ) : (
            <div className="table-container" style={{ overflowX: 'auto', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)' }}>
              <table style={{ minWidth: '100%', whiteSpace: 'nowrap' }}>
                <thead>
                  <tr>
                    <th style={{ position: 'sticky', left: 0, zIndex: 10, background: 'var(--gray-50)', minWidth: '120px' }}>학생 이름</th>
                    {assignments.map(a => (
                      <th key={a.id} style={{ minWidth: '160px', textAlign: 'center', padding: '1rem' }}>
                        <div style={{ display: 'inline-block', padding: '0.2rem 0.5rem', background: a.type === '수행평가' ? '#FFF4ED' : '#ECFDF5', color: a.type === '수행평가' ? '#E8590C' : '#059669', borderRadius: '4px', fontSize: '0.75rem', marginBottom: '0.4rem' }}>{a.type}</div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 700, marginBottom: '0.25rem', whiteSpace: 'normal', wordBreak: 'keep-all' }}>{a.title}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{a.dueDate}</div>
                        {isAdmin && (
                          <button style={{ background: 'transparent', border: 'none', color: '#DC2626', fontSize: '0.75rem', cursor: 'pointer', marginTop: '0.5rem', fontWeight: 600 }} onClick={() => {
                            if (confirm('이 항목을 정말 삭제하시겠습니까?')) {
                              dispatch({ type: 'DELETE_ASSIGNMENT', payload: a.id });
                              showToast('삭제되었습니다.', 'success');
                            }
                          }}>🗑️ 삭제</button>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {students.map(s => (
                    <tr key={s.id}>
                      <td style={{ position: 'sticky', left: 0, zIndex: 5, background: 'var(--bg-card)', fontWeight: 600, borderRight: '1px solid var(--border-light)' }}>
                        {s.number}번 <span style={{ marginLeft: '0.25rem' }}>{s.name}</span>
                      </td>
                      {assignments.map(a => {
                        const submission = a.submissions?.[s.id];
                        const grade = submission?.grade;
                        return (
                          <td key={`${s.id}-${a.id}`} style={{ textAlign: 'center', background: submission ? 'transparent' : '#FEF2F2' }}>
                            {submission ? (
                              isAdmin ? (
                                <div style={{ display: 'flex', gap: '0.25rem', justifyContent: 'center' }}>
                                  <button className={`grade-btn ${grade === '상' ? 'active top' : ''}`} style={{ padding: '4px 10px', borderRadius: '4px', border: '1px solid var(--border-light)', background: grade === '상' ? 'var(--primary)' : 'white', color: grade === '상' ? 'white' : 'var(--text-secondary)', cursor: 'pointer', fontWeight: 600, fontSize: '0.75rem' }} onClick={() => handleEvaluate(a.id, s.id, '상')}>상</button>
                                  <button className={`grade-btn ${grade === '중' ? 'active mid' : ''}`} style={{ padding: '4px 10px', borderRadius: '4px', border: '1px solid var(--border-light)', background: grade === '중' ? 'var(--primary)' : 'white', color: grade === '중' ? 'white' : 'var(--text-secondary)', cursor: 'pointer', fontWeight: 600, fontSize: '0.75rem' }} onClick={() => handleEvaluate(a.id, s.id, '중')}>중</button>
                                  <button className={`grade-btn ${grade === '하' ? 'active bot' : ''}`} style={{ padding: '4px 10px', borderRadius: '4px', border: '1px solid var(--border-light)', background: grade === '하' ? 'var(--primary)' : 'white', color: grade === '하' ? 'white' : 'var(--text-secondary)', cursor: 'pointer', fontWeight: 600, fontSize: '0.75rem' }} onClick={() => handleEvaluate(a.id, s.id, '하')}>하</button>
                                </div>
                              ) : (
                                <span style={{ display: 'inline-block', padding: '0.25rem 0.75rem', background: '#D1FAE5', color: '#065F46', borderRadius: '4px', fontWeight: 700, fontSize: '0.8rem' }}>
                                  {grade || '채점 대기'}
                                </span>
                              )
                            ) : (
                              <span style={{ color: '#DC2626', fontSize: '0.8rem', fontWeight: 600 }}>미제출</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Student Detail Modal */}
      {selectedStudent && (
        <div className="modal-overlay" onMouseDown={e => { e.currentTarget._mouseDownTarget = e.target; }} onClick={e => { if (e.target === e.currentTarget && e.currentTarget._mouseDownTarget === e.currentTarget) { setSelectedStudent(null); setIsEditingName(false); } }}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">학생 정보</h3>
              <button className="modal-close" onClick={() => { setSelectedStudent(null); setIsEditingName(false); }}>&times;</button>
            </div>
            <div className="modal-body" style={{maxHeight:'70vh', overflowY:'auto'}}>
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
                            updateStudent({ id: selectedStudent.id, name: editNameValue.trim() });
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
                        {isAdmin && (
                          <button className="edit-name-btn" onClick={() => {
                            setEditNameValue(selectedStudent.name);
                            setIsEditingName(true);
                          }} style={{background:'transparent', border:'none', cursor:'pointer', color:'var(--text-muted)', fontSize:'1.2rem'}} title="이름 수정">✎</button>
                        )}
                      </div>
                    )}
                  </div>
                  <p>{selectedStudent.number}번 · {selectedStudent.gender === 'M' ? '남학생' : '여학생'} · 생일: {selectedStudent.birthday}</p>
                </div>
              </div>

              {/* Editable Fields */}
              {isAdmin && (
                <div className="student-edit-section">
                  <h4 style={{fontSize:'0.875rem', fontWeight:700, marginBottom:'0.75rem'}}>📝 정보 수정</h4>
                  <div className="edit-fields-grid">
                    <div className="edit-field">
                      <label>성별</label>
                      <select className="form-input" value={editGender} onChange={e => setEditGender(e.target.value)}>
                        <option value="M">남</option>
                        <option value="F">여</option>
                      </select>
                    </div>
                    <div className="edit-field">
                      <label>생일</label>
                      <input type="date" className="form-input" value={editBirthday} onChange={e => setEditBirthday(e.target.value)} />
                    </div>
                    <div className="edit-field">
                      <label>연락처</label>
                      <input type="text" className="form-input" value={editParentPhone} onChange={e => setEditParentPhone(e.target.value)} placeholder="010-0000-0000" />
                    </div>
                    <div className="edit-field" style={{display:'flex', gap:'0.5rem', alignItems:'flex-end'}}>
                      <button className="btn btn-primary btn-sm" onClick={handleSaveStudentInfo}>저장</button>
                      <button className="btn btn-danger btn-sm" onClick={handleResetPoints}>포인트 초기화</button>
                    </div>
                  </div>
                </div>
              )}

              <div style={{marginBottom:'0.75rem'}}>
                <strong style={{fontSize:'0.875rem'}}>📞 학부모 연락처:</strong>
                <span style={{marginLeft:'0.5rem',fontSize:'0.875rem'}}>{selectedStudent.parentPhone || '미등록'}</span>
              </div>

              {/* 관찰/상담 기록 입력 */}
              {isAdmin && (
                <div className="record-input-section">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <h4 style={{fontSize:'0.875rem', fontWeight:700, margin: 0}}>📋 관찰/상담 기록 추가</h4>
                  </div>
                  <div className="record-input-row">
                    <select className="form-input" value={newRecordType} onChange={e => setNewRecordType(e.target.value)} style={{width:'auto', minWidth:'100px'}}>
                      <option value="observation">관찰</option>
                      <option value="counseling">상담</option>
                    </select>
                    <select className="form-input" value={newRecordCategory} onChange={e => setNewRecordCategory(e.target.value)} style={{width:'auto', minWidth:'80px'}}>
                      <option value="생활">생활</option>
                      <option value="학습">학습</option>
                      <option value="교우">교우</option>
                      <option value="건강">건강</option>
                      <option value="기타">기타</option>
                    </select>
                  </div>
                  <div className="record-input-row" style={{marginTop:'0.5rem'}}>
                    <textarea 
                      className="form-input" 
                      placeholder="관찰/상담 내용을 입력하세요..." 
                      value={newRecordContent} 
                      onChange={e => setNewRecordContent(e.target.value)}
                      rows="4"
                      style={{resize:'vertical', flex:1}}
                    />
                    <button className="btn btn-primary" onClick={handleAddRecord} style={{alignSelf:'flex-end'}}>저장</button>
                  </div>
                </div>
              )}

              {/* 관찰/상담 기록 목록 */}
              {records.length > 0 && (
                <div className="records-list-section">
                  <h4 style={{fontSize:'0.875rem', fontWeight:700, marginBottom:'0.75rem'}}>
                    📖 기록 목록 ({records.length}건)
                  </h4>
                  <div className="counseling-list" style={{marginTop:'0.5rem'}}>
                    {records.map((c, i) => (
                      <div key={c.id || i} className="counseling-item">
                        <div className="counseling-date">
                          {c.date} · <span className={`record-type-badge ${c.type}`}>
                            {c.type === 'observation' ? '관찰' : c.type === 'counseling' ? '상담' : c.type}
                          </span> · {c.category}
                          {isAdmin && (
                            <button style={{background:'transparent', border:'none', color:'#DC2626', fontSize:'0.75rem', cursor:'pointer', marginLeft:'0.5rem', fontWeight:600}} onClick={() => {
                              if (confirm('이 기록을 삭제하시겠습니까?')) {
                                deleteStudentRecord(selectedStudent.id, c.id);
                              }
                            }}>🗑️ 삭제</button>
                          )}
                        </div>
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

      {/* Bulk Name Update Modal */}
      {showBulkModal && (
        <div className="modal-overlay" onMouseDown={e => { e.currentTarget._mouseDownTarget = e.target; }} onClick={e => { if (e.target === e.currentTarget && e.currentTarget._mouseDownTarget === e.currentTarget) setShowBulkModal(false); }}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{maxWidth:'450px'}}>
            <div className="modal-header">
              <h3 className="modal-title">📝 학생 이름 일괄 수정</h3>
              <button className="modal-close" onClick={() => setShowBulkModal(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <p style={{fontSize:'0.8rem', color:'var(--text-secondary)', marginBottom:'0.75rem'}}>
                한 줄에 한 명씩 탭(Tab)이나 쉼표(,)로 구분하여 <strong>이름, 성별(M/F), 생일(YYYY-MM-DD)</strong>을 입력하세요.<br/>
                (예: <code>김학생, M, 2014-05-01</code>)
              </p>
              <textarea 
                className="form-input" 
                value={bulkNames} 
                onChange={e => setBulkNames(e.target.value)}
                rows="15"
                style={{resize:'vertical', fontFamily:'monospace', lineHeight:'1.8'}}
                placeholder="이름&#9;성별&#9;생일&#10;강민준&#9;M&#9;2014-01-01&#10;고서연&#9;F&#9;2014-02-15&#10;..."
              />
              <div style={{display:'flex', gap:'0.5rem', marginTop:'0.75rem', justifyContent:'flex-end'}}>
                <button className="btn btn-secondary" onClick={() => setShowBulkModal(false)}>취소</button>
                <button className="btn btn-primary" onClick={handleBulkUpdate}>저장</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
