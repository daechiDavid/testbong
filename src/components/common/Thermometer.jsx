import './Thermometer.css';

export default function Thermometer({ current, goal }) {
  const percentage = Math.min((current / goal) * 100, 100);
  const isGoalReached = current >= goal;

  return (
    <div className="card thermometer-card">
      <div className="card-header">
        <h3 className="card-title"><span className="emoji">🌡️</span> 우리반 칭찬 온도계</h3>
        <span className="badge badge-primary">목표: {goal}점</span>
      </div>
      
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
              <div className="marker-h" style={{left: '25%'}}><span>25%</span></div>
              <div className="marker-h" style={{left: '50%'}}><span>절반!</span></div>
              <div className="marker-h" style={{left: '75%'}}><span>75%</span></div>
              <div className="marker-h" style={{left: '100%'}}><span>목표 달성 🏆</span></div>
            </div>
          </div>
        </div>
      </div>
      
      {isGoalReached && (
        <div className="thermometer-celebration">
          🎉 축하합니다! 학급 전체 보상을 달성했습니다! 🎉
        </div>
      )}
    </div>
  );
}
