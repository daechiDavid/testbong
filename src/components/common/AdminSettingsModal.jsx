import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import './AdminSettingsModal.css';

export default function AdminSettingsModal({ onClose }) {
  const { state, dispatch, showToast } = useApp();
  const { settings } = state;

  const [pin, setPin] = useState(settings.adminPin);
  const [goal, setGoal] = useState(settings.thermometerGoal);
  const [calendarId, setCalendarId] = useState(settings.calendarId);

  const handleSave = () => {
    if (pin.length !== 4) {
      showToast('PIN은 4자리 숫자여야 합니다.', 'error');
      return;
    }
    
    dispatch({ 
      type: 'UPDATE_SETTINGS', 
      payload: { 
        adminPin: pin, 
        thermometerGoal: parseInt(goal) || 1500, 
        calendarId 
      } 
    });
    showToast('설정이 저장되었습니다.', 'success');
    onClose();
  };

  return (
    <div className="settings-modal-overlay" onClick={onClose}>
      <div className="settings-modal-content" onClick={e => e.stopPropagation()}>
        <div className="settings-modal-header">
          <h3>⚙️ 관리자 설정</h3>
          <button className="settings-close-btn" onClick={onClose}>×</button>
        </div>
        <div className="settings-modal-body">
          <div className="settings-form-group">
            <label>관리자 PIN (4자리 숫자)</label>
            <input 
              type="password" 
              className="settings-form-input" 
              maxLength="4"
              value={pin} 
              onChange={e => setPin(e.target.value.replace(/[^0-9]/g, ''))} 
            />
          </div>
          <div className="settings-form-group">
            <label>학급 온도계 목표 점수</label>
            <input 
              type="number" 
              className="settings-form-input" 
              value={goal} 
              onChange={e => setGoal(e.target.value)} 
            />
          </div>
          <div className="settings-form-group">
            <label>구글 캘린더 ID (공개)</label>
            <input 
              type="text" 
              className="settings-form-input" 
              placeholder="예: ...@group.calendar.google.com"
              value={calendarId} 
              onChange={e => setCalendarId(e.target.value)} 
            />
            <small className="settings-help-text">구글 캘린더 설정의 '캘린더 ID'를 복사해 넣으세요. 캘린더가 전체 공개여야 합니다.</small>
          </div>
        </div>
        <div className="settings-modal-footer">
          <button className="settings-btn settings-btn-secondary" onClick={onClose}>취소</button>
          <button className="settings-btn settings-btn-primary" onClick={handleSave}>저장</button>
        </div>
      </div>
    </div>
  );
}
