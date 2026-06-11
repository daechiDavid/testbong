import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import './AdminSettingsModal.css';

export default function AdminSettingsModal({ onClose }) {
  const { state, dispatch, showToast } = useApp();
  const { settings } = state;

  const [calendarId1, setCalendarId1] = useState(settings.calendarId1 || '');
  const [calendarId2, setCalendarId2] = useState(settings.calendarId2 || '');
  const [calendarId3, setCalendarId3] = useState(settings.calendarId3 || '');
  const [geminiApiKey, setGeminiApiKey] = useState(settings.geminiApiKey || '');

  const handleSave = () => {
    dispatch({ 
      type: 'UPDATE_SETTINGS', 
      payload: { 
        ...settings,
        calendarId1, 
        calendarId2, 
        calendarId3, 
        geminiApiKey 
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
            <label>🤖 제미나이(Gemini) API 키</label>
            <input 
              type="password" 
              className="settings-form-input" 
              placeholder="AI 행동발달 종합의견을 위한 API 키 입력"
              value={geminiApiKey} 
              onChange={e => setGeminiApiKey(e.target.value)} 
            />
            <small className="settings-help-text">구글 AI Studio에서 발급받은 API 키를 입력하세요. 브라우저에 안전하게 저장됩니다.</small>
          </div>
          <div className="settings-form-group">
            <label>📅 구글 캘린더 ID 1 (필수)</label>
            <input 
              type="text" 
              className="settings-form-input" 
              placeholder="예: ...@group.calendar.google.com"
              value={calendarId1} 
              onChange={e => setCalendarId1(e.target.value)} 
            />
          </div>
          <div className="settings-form-group">
            <label>📅 구글 캘린더 ID 2 (선택)</label>
            <input 
              type="text" 
              className="settings-form-input" 
              value={calendarId2} 
              onChange={e => setCalendarId2(e.target.value)} 
            />
          </div>
          <div className="settings-form-group">
            <label>📅 구글 캘린더 ID 3 (선택)</label>
            <input 
              type="text" 
              className="settings-form-input" 
              value={calendarId3} 
              onChange={e => setCalendarId3(e.target.value)} 
            />
            <small className="settings-help-text">일정 및 공지 페이지에 표시할 구글 캘린더 ID를 입력하세요. (최대 3개)</small>
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
