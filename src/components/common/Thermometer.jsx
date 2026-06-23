import { useState } from 'react';
import './Thermometer.css';

export default function Thermometer({ current, goal, reward, isAdmin, onUpdate }) {
  const percentage = Math.min((current / goal) * 100, 100);
  const isGoalReached = current >= goal;
  const [isEditing, setIsEditing] = useState(false);
  const [editGoal, setEditGoal] = useState(goal);
  const [editReward, setEditReward] = useState(reward || '');

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(parseInt(editGoal) || 1500, editReward);
    }
    setIsEditing(false);
  };

  return (
    <>
      {/* 다른 위젯과 드래그 핸들 및 스타일 일치를 위한 공통 헤더 구조 */}
      <div className="card-header" style={{ alignItems: 'flex-start', cursor: isAdmin ? 'move' : 'default' }}>
        <div>
          <h3 className="card-title"><span className="emoji">🌡️</span> 우리반 칭찬 온도계</h3>
        </div>
        {!isEditing ? (
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span className="badge badge-primary">목표: {goal}점</span>
            {isAdmin && <button className="icon-btn" onClick={() => setIsEditing(true)}>✏️</button>}
          </div>
        ) : null}
      </div>
      
      {/* 위젯 콘텐츠 영역 */}
      <div className="widget-content" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1, paddingBottom: '1.5rem' }}>
        {!isEditing ? (
          <div className="thermometer-reward-text" style={{ marginBottom: '1rem', marginTop: '-0.5rem', textAlign: 'center' }}>
            보상: {reward || '설정된 보상이 없습니다'}
          </div>
        ) : null}

        {isEditing && isAdmin && (
          <div className="thermometer-edit-form" style={{ marginTop: '-0.5rem', marginBottom: '1rem' }}>
            <input type="number" value={editGoal} onChange={e => setEditGoal(e.target.value)} placeholder="목표 점수" className="form-input" style={{ width: '100px' }} />
            <input type="text" value={editReward} onChange={e => setEditReward(e.target.value)} placeholder="보상 내용" className="form-input" style={{ flex: 1 }} />
            <button className="btn btn-primary" onClick={handleSave}>저장</button>
            <button className="btn btn-secondary" onClick={() => setIsEditing(false)}>취소</button>
          </div>
        )}

        <div className="thermometer-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div className="thermometer-score-display" style={{ marginBottom: '1rem' }}>
            <div className="current-score-huge">
              {current}<span className="unit">점</span>
            </div>
            <div className="score-percent">
              현재 목표의 <strong>{percentage.toFixed(1)}%</strong> 달성 중! 🚀
            </div>
          </div>

          <div className="thermometer-horizontal" style={{ marginBottom: '1.5rem' }}>
            <div className="thermometer-track">
              <div
                className={`thermometer-progress ${isGoalReached ? 'goal-reached' : ''}`}
                style={{ width: `${percentage}%` }}
              >
                <div className="thermometer-glow"></div>
              </div>

              {/* Markers */}
              <div className="thermometer-markers-h">
                <div className="marker-h" style={{ left: '25%' }}><span>25%</span></div>
                <div className="marker-h" style={{ left: '50%' }}><span>절반!</span></div>
                <div className="marker-h" style={{ left: '75%' }}><span>75%</span></div>
                <div className="marker-h" style={{ left: '100%' }}><span>목표 달성 🏆</span></div>
              </div>
            </div>
          </div>
        </div>

        {isGoalReached && !isEditing && (
          <div className="thermometer-celebration" style={{ marginTop: '0.5rem' }}>
            🎉 축하합니다! {reward ? `'${reward}'` : '학급 전체 보상'}을(를) 달성했습니다! 🎉
          </div>
        )}
      </div>
    </>
  );
}
