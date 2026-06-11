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
    <div className="card thermometer-card">
      <div className="card-header" style={{ alignItems: 'flex-start' }}>
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
      
      {!isEditing ? (
        <div className="thermometer-reward-text" style={{ marginBottom: '1.5rem', marginTop: '-0.5rem', textAlign: 'center' }}>
          보상: {reward || '설정된 보상이 없습니다'}
        </div>
      ) : null}

      {isEditing && isAdmin && (
        <div className="thermometer-edit-form">
          <input type="number" value={editGoal} onChange={e => setEditGoal(e.target.value)} placeholder="목표 점수" className="form-input" style={{ width: '100px' }} />
          <input type="text" value={editReward} onChange={e => setEditReward(e.target.value)} placeholder="보상 내용" className="form-input" style={{ flex: 1 }} />
          <button className="btn btn-primary" onClick={handleSave}>저장</button>
          <button className="btn btn-secondary" onClick={() => setIsEditing(false)}>취소</button>
        </div>
      )}

      <div className="thermometer-content">
        <div className="thermometer-score-display">
          <div className="current-score-huge">
            {current}<span className="unit">점</span>
          </div>
          <div className="score-percent">
            현재 목표의 <strong>{percentage.toFixed(1)}%</strong> 달성 중! 🚀
          </div>
        </div>

        <div className="thermometer-horizontal">
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
        <div className="thermometer-celebration">
          🎉 축하합니다! {reward ? `'${reward}'` : '학급 전체 보상'}을(를) 달성했습니다! 🎉
        </div>
      )}
    </div>
  );
}
