import { useState, useRef, useCallback, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { shuffleArray } from '../utils/helpers';
import './ToolsPage.css';

export default function ToolsPage() {
  const { state, dispatch, showToast, addPoll, deletePoll, votePoll } = useApp();
  const { students, polls, isAdmin } = state;

  // ===== Random Picker =====
  const [pickerResult, setPickerResult] = useState('?');
  const [pickerHistory, setPickerHistory] = useState([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [pickerCount, setPickerCount] = useState(1);
  const spinRef = useRef(null);

  const handlePick = useCallback(() => {
    if (isSpinning) return;
    const available = students.filter(s => !pickerHistory.find(h => h.id === s.id));
    if (available.length === 0) { showToast('모든 학생이 이미 뽑혔습니다!', 'warning'); return; }
    setIsSpinning(true);
    let count = 0;
    const maxCount = 20;
    spinRef.current = setInterval(() => {
      const rand = available[Math.floor(Math.random() * available.length)];
      setPickerResult(rand.name);
      count++;
      if (count >= maxCount) {
        clearInterval(spinRef.current);
        const picks = shuffleArray(available).slice(0, Math.min(pickerCount, available.length));
        setPickerResult(picks.map(p => p.name).join(', '));
        setPickerHistory(prev => [...prev, ...picks]);
        setIsSpinning(false);
      }
    }, 80);
  }, [isSpinning, students, pickerHistory, pickerCount, showToast]);

  const resetPicker = () => { setPickerHistory([]); setPickerResult('?'); };

  // ===== Timer =====
  const [timerMode, setTimerMode] = useState('timer');
  const [timerSeconds, setTimerSeconds] = useState(300);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerElapsed, setTimerElapsed] = useState(0); // ms for stopwatch
  const [isAlarm, setIsAlarm] = useState(false);
  const [customMin, setCustomMin] = useState('');
  const [customSec, setCustomSec] = useState('');
  const timerRef = useRef(null);

  const presets = [{ label: '1분', sec: 60 }, { label: '3분', sec: 180 }, { label: '5분', sec: 300 }, { label: '10분', sec: 600 }, { label: '15분', sec: 900 }];

  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const formatStopwatch = (ms) => {
    const totalSec = Math.floor(ms / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    const cs = Math.floor((ms % 1000) / 10);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(cs).padStart(2, '0')}`;
  };

  const startTimer = () => {
    if (timerRunning) return;
    setIsAlarm(false);
    setTimerRunning(true);
    if (timerMode === 'timer') {
      timerRef.current = setInterval(() => {
        setTimerSeconds(prev => {
          if (prev <= 1) { clearInterval(timerRef.current); setTimerRunning(false); setIsAlarm(true); showToast('⏰ 시간 종료!', 'warning'); return 0; }
          return prev - 1;
        });
      }, 1000);
    } else {
      const startTime = Date.now() - timerElapsed;
      timerRef.current = setInterval(() => {
        setTimerElapsed(Date.now() - startTime);
      }, 10);
    }
  };

  const pauseTimer = () => { clearInterval(timerRef.current); setTimerRunning(false); };
  const resetTimer = () => { clearInterval(timerRef.current); setTimerRunning(false); setTimerSeconds(300); setTimerElapsed(0); setIsAlarm(false); };

  const applyCustomTime = () => {
    const m = parseInt(customMin) || 0;
    const s = parseInt(customSec) || 0;
    if (m === 0 && s === 0) { showToast('시간을 입력해주세요', 'error'); return; }
    setTimerSeconds(m * 60 + s);
    showToast(`${m}분 ${s}초로 설정되었습니다`, 'success');
  };

  useEffect(() => () => { clearInterval(timerRef.current); clearInterval(spinRef.current); }, []);

  // ===== Group Maker =====
  const [groupCount, setGroupCount] = useState(4);
  const [groups, setGroups] = useState([]);

  const makeGroups = () => {
    const shuffled = shuffleArray(students);
    const result = Array.from({ length: groupCount }, () => []);
    shuffled.forEach((s, i) => result[i % groupCount].push(s));
    setGroups(result);
    showToast(`${groupCount}개 팀이 편성되었습니다!`, 'success');
  };

  // ===== Poll =====
  const [newPollQ, setNewPollQ] = useState('');
  const [newPollOpts, setNewPollOpts] = useState(['', '']);

  // 세션별 투표 추적
  const getVotedPolls = () => {
    try {
      return JSON.parse(sessionStorage.getItem('votedPolls') || '{}');
    } catch { return {}; }
  };

  const markPollVoted = (pollId) => {
    const voted = getVotedPolls();
    voted[pollId] = true;
    sessionStorage.setItem('votedPolls', JSON.stringify(voted));
  };

  const hasVoted = (pollId) => {
    return !!getVotedPolls()[pollId];
  };

  const handleAddPoll = async () => {
    if (!newPollQ.trim() || newPollOpts.filter(o => o.trim()).length < 2) {
      showToast('질문과 최소 2개 항목을 입력하세요', 'error');
      return;
    }
    const opts = newPollOpts.filter(o => o.trim());
    const newId = crypto.randomUUID();
    const pollData = { id: newId, question: newPollQ, options: opts, votes: opts.map(() => 0), isActive: true };
    await addPoll(pollData);
    setNewPollQ(''); setNewPollOpts(['', '']);
    showToast('투표가 생성되었습니다!', 'success');
  };

  const handleVote = async (pollId, optIdx) => {
    if (hasVoted(pollId)) {
      showToast('이미 투표하셨습니다!', 'warning');
      return;
    }
    await votePoll(pollId, optIdx);
    markPollVoted(pollId);
    showToast('투표가 완료되었습니다!', 'success');
  };

  const handleDeletePoll = async (pollId) => {
    await deletePoll(pollId);
    showToast('투표가 삭제되었습니다.', 'success');
  };

  return (
    <div className="tools-page">
      <div className="tools-grid">
        {/* Random Picker */}
        <div className={`tool-card ${!isAdmin ? 'disabled-tool' : ''}`}>
          <div className="tool-card-header">
            <span className="tool-emoji">🎲</span>
            <div><div className="tool-title">랜덤 뽑기</div><div className="tool-desc">발표자를 랜덤으로 선택해요</div></div>
          </div>
          <div className="picker-container">
            <div className="roulette-wheel">
              <div className="roulette-pointer" />
              <div className={`roulette-circle ${isSpinning ? 'spinning' : pickerResult !== '?' ? 'reveal' : ''}`}>
                <div className="roulette-result">{pickerResult}</div>
              </div>
            </div>
            {isAdmin && (
              <div className="picker-count">
                <label>뽑을 인원:</label>
                <input type="number" min="1" max="28" value={pickerCount} onChange={e => setPickerCount(Math.max(1, parseInt(e.target.value) || 1))} />
                <span>명</span>
              </div>
            )}
            {isAdmin && (
              <div style={{display:'flex',gap:'0.5rem',justifyContent:'center'}}>
                <button className="btn btn-primary btn-lg" onClick={handlePick} disabled={isSpinning}>
                  {isSpinning ? '🎰 뽑는 중...' : '🎲 뽑기!'}
                </button>
                <button className="btn btn-secondary" onClick={resetPicker}>초기화</button>
              </div>
            )}
            {pickerHistory.length > 0 && (
              <div className="picker-history">
                {pickerHistory.map((s, i) => <span key={i} className="picked-badge">{s.name}</span>)}
              </div>
            )}
          </div>
        </div>

        {/* Timer */}
        <div className={`tool-card ${!isAdmin ? 'disabled-tool' : ''}`}>
          <div className="tool-card-header">
            <span className="tool-emoji">⏱️</span>
            <div><div className="tool-title">타이머 / 스톱워치</div><div className="tool-desc">활동 시간을 관리해요</div></div>
          </div>
          <div className="timer-container">
            <div className="timer-mode-toggle">
              <button className={`timer-mode-btn ${timerMode === 'timer' ? 'active' : ''}`} onClick={() => { resetTimer(); setTimerMode('timer'); }}>⏳ 타이머</button>
              <button className={`timer-mode-btn ${timerMode === 'stopwatch' ? 'active' : ''}`} onClick={() => { resetTimer(); setTimerMode('stopwatch'); }}>⏱️ 스톱워치</button>
            </div>
            <div className={`timer-display ${timerRunning ? 'running' : ''} ${isAlarm ? 'alarm' : ''}`}>
              {timerMode === 'timer' ? formatTimer(timerSeconds) : formatStopwatch(timerElapsed)}
            </div>
            {timerMode === 'timer' && (
              <>
                <div className="timer-presets">
                  {presets.map(p => (
                    <button key={p.sec} className={`timer-preset ${timerSeconds === p.sec && !timerRunning ? 'active' : ''}`} onClick={() => { if (!timerRunning) setTimerSeconds(p.sec); }}>{p.label}</button>
                  ))}
                </div>
                {!timerRunning && (
                  <div className="timer-custom-input">
                    <input 
                      type="number" 
                      className="custom-time-input" 
                      placeholder="분" 
                      min="0" 
                      max="99"
                      value={customMin} 
                      onChange={e => setCustomMin(e.target.value)} 
                    />
                    <span className="time-separator">:</span>
                    <input 
                      type="number" 
                      className="custom-time-input" 
                      placeholder="초" 
                      min="0" 
                      max="59"
                      value={customSec} 
                      onChange={e => setCustomSec(e.target.value)} 
                    />
                    <button className="btn btn-sm btn-primary" onClick={applyCustomTime}>적용</button>
                  </div>
                )}
              </>
            )}
            <div className="timer-controls">
              {!timerRunning
                ? <button className="btn btn-primary" onClick={startTimer}>▶ 시작</button>
                : <button className="btn btn-secondary" onClick={pauseTimer}>⏸ 일시정지</button>
              }
              <button className="btn btn-danger" onClick={resetTimer} style={{background:'var(--danger)',color:'white'}}>↺ 초기화</button>
            </div>
          </div>
        </div>

        {/* Group Maker */}
        <div className={`tool-card ${!isAdmin ? 'disabled-tool' : ''}`}>
          <div className="tool-card-header">
            <span className="tool-emoji">👥</span>
            <div><div className="tool-title">팀 편성</div><div className="tool-desc">랜덤으로 팀을 나눠요</div></div>
          </div>
          <div className="group-maker">
            {isAdmin && (
              <div className="group-settings">
                <div className="group-setting">
                  <label>팀 수:</label>
                  <input type="number" min="2" max="14" value={groupCount} onChange={e => setGroupCount(Math.max(2, parseInt(e.target.value) || 2))} />
                  <span>개</span>
                </div>
                <button className="btn btn-primary" onClick={makeGroups}>🔀 팀 편성하기</button>
              </div>
            )}
            {groups.length > 0 && (
              <div className="groups-result">
                {groups.map((g, i) => (
                  <div key={i} className="group-card" style={{animationDelay:`${i * 0.1}s`}}>
                    <div className="group-card-title">{i + 1}팀</div>
                    <div className="group-members">
                      {g.map(s => (
                        <div key={s.id} className="group-member">
                          <span>{s.gender === 'M' ? '👦' : '👧'}</span>
                          <span>{s.number}. {s.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Poll */}
        <div className="tool-card">
          <div className="tool-card-header">
            <span className="tool-emoji">📊</span>
            <div><div className="tool-title">투표 / 설문</div><div className="tool-desc">학급 의견을 모아요</div></div>
          </div>
          <div className="poll-container">
            {/* New Poll Form */}
            {isAdmin && (
              <div className="poll-form">
                <input className="form-input" placeholder="투표 질문을 입력하세요" value={newPollQ} onChange={e => setNewPollQ(e.target.value)} style={{marginBottom:'0.5rem'}} />
                <div className="poll-options-list">
                  {newPollOpts.map((opt, i) => (
                    <div key={i} className="poll-option-input">
                      <input className="form-input" placeholder={`항목 ${i+1}`} value={opt} onChange={e => { const o = [...newPollOpts]; o[i] = e.target.value; setNewPollOpts(o); }} />
                      {newPollOpts.length > 2 && <button className="poll-remove" onClick={() => setNewPollOpts(newPollOpts.filter((_,j) => j !== i))}>×</button>}
                    </div>
                  ))}
                </div>
                <div style={{display:'flex',gap:'0.5rem'}}>
                  <button className="btn btn-secondary btn-sm" onClick={() => setNewPollOpts([...newPollOpts, ''])}>+ 항목 추가</button>
                  <button className="btn btn-primary btn-sm" onClick={handleAddPoll}>투표 생성</button>
                </div>
              </div>
            )}

            {/* Active Polls */}
            {polls.map(p => {
              const totalVotes = p.votes.reduce((a, b) => a + b, 0);
              const voted = hasVoted(p.id);
              return (
                <div key={p.id} className="poll-active">
                  <div className="poll-header-row">
                    <h4 className="poll-question">{p.question}</h4>
                    {isAdmin && (
                      <button className="poll-delete-btn" onClick={() => handleDeletePoll(p.id)} title="투표 삭제">
                        🗑️
                      </button>
                    )}
                  </div>
                  {voted && <div className="poll-voted-badge">✅ 투표 완료</div>}
                  <div className="poll-results">
                    {p.options.map((opt, i) => {
                      const pct = totalVotes > 0 ? Math.round((p.votes[i] / totalVotes) * 100) : 0;
                      return (
                        <div 
                          key={i} 
                          className={`poll-result-item ${voted ? 'voted' : ''}`} 
                          onClick={() => !voted && handleVote(p.id, i)} 
                          style={{cursor: voted ? 'default' : 'pointer'}}
                        >
                          <span className="poll-result-label">{opt}</span>
                          <div className="poll-result-bar">
                            <div className="poll-result-fill" style={{width:`${pct}%`}}>{pct > 10 ? `${pct}%` : ''}</div>
                          </div>
                          <span className="poll-result-count">{p.votes[i]}표</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="poll-total">총 {totalVotes}표</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
