import { useState } from 'react';
import { useApp } from '../context/AppContext';
import './LinksPage.css';

export default function LinksPage() {
  const { state, dispatch, showToast } = useApp();
  const { quickLinks, isAdmin } = state;
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ title: '', url: '', icon: '🔗', desc: '' });

  const handleEdit = (link) => {
    setEditingId(link.id);
    setFormData(link);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      dispatch({ type: 'DELETE_LINK', payload: id });
      showToast('삭제되었습니다.', 'success');
    }
  };

  const handleSave = () => {
    if (!formData.title || !formData.url) {
      showToast('이름과 주소를 모두 입력해주세요.', 'error');
      return;
    }
    const url = formData.url.startsWith('http') ? formData.url : `https://${formData.url}`;
    
    if (editingId) {
      dispatch({ type: 'UPDATE_LINK', payload: { ...formData, url, id: editingId } });
      showToast('수정되었습니다.', 'success');
    } else {
      dispatch({ type: 'ADD_LINK', payload: { ...formData, url, id: Date.now() } });
      showToast('추가되었습니다.', 'success');
    }
    setShowForm(false);
    setEditingId(null);
    setFormData({ title: '', url: '', icon: '🔗', desc: '' });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ title: '', url: '', icon: '🔗', desc: '' });
  };

  return (
    <div className="links-page">
      <div className="links-header">
        <h2 className="section-title">🔗 즐겨찾기 & 바로가기</h2>
        {isAdmin && (
          <button className="btn btn-primary" onClick={() => setShowForm(true)} disabled={showForm}>
            + 링크 추가
          </button>
        )}
      </div>

      {isAdmin && showForm && (
        <div className="card links-form">
          <h3 style={{marginBottom:'1rem', fontSize:'1.125rem'}}>{editingId ? '링크 수정' : '새 링크 추가'}</h3>
          <div className="form-row">
            <div className="form-group" style={{flex: 1}}>
              <label>아이콘 (이모지)</label>
              <input className="form-input" value={formData.icon} onChange={e => setFormData({...formData, icon: e.target.value})} maxLength="2" />
            </div>
            <div className="form-group" style={{flex: 4}}>
              <label>이름</label>
              <input className="form-input" placeholder="예: 구글 번역" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            </div>
          </div>
          <div className="form-group">
            <label>주소 (URL)</label>
            <input className="form-input" placeholder="https://..." value={formData.url} onChange={e => setFormData({...formData, url: e.target.value})} />
          </div>
          <div className="form-group">
            <label>설명 (선택)</label>
            <input className="form-input" placeholder="어떤 사이트인지 설명..." value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} />
          </div>
          <div className="form-actions">
            <button className="btn btn-secondary" onClick={handleCancel}>취소</button>
            <button className="btn btn-primary" onClick={handleSave}>저장</button>
          </div>
        </div>
      )}

      <div className="links-grid">
        {quickLinks.map(link => (
          <div key={link.id} className="link-card-wrapper">
            <a href={link.url} target="_blank" rel="noopener noreferrer" className="link-card card">
              <div className="link-icon">{link.icon}</div>
              <div className="link-content">
                <h3 className="link-title">{link.title}</h3>
                {link.desc && <p className="link-desc">{link.desc}</p>}
              </div>
            </a>
            {isAdmin && (
              <div className="link-actions">
                <button className="btn-icon link-action-btn" onClick={() => handleEdit(link)}>✏️</button>
                <button className="btn-icon link-action-btn" onClick={() => handleDelete(link.id)}>🗑️</button>
              </div>
            )}
          </div>
        ))}
        {quickLinks.length === 0 && (
          <div className="empty-state" style={{gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)'}}>
            등록된 즐겨찾기가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
