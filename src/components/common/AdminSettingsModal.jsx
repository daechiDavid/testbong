"use client";

import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import './AdminSettingsModal.css';

export default function AdminSettingsModal({ onClose }) {
  const { state, updateSettings, showToast } = useApp();
  const { settings } = state;

  const [calendarId1, setCalendarId1] = useState(settings.calendarId1 || '');
  const [calendarId2, setCalendarId2] = useState(settings.calendarId2 || '');
  const [calendarId3, setCalendarId3] = useState(settings.calendarId3 || '');

  const handleSave = async () => {
    await updateSettings({ 
      ...settings,
      calendarId1, 
      calendarId2, 
      calendarId3
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

