import { useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { formatDate } from '../../utils/helpers'
import { useAdminMode } from '../../hooks/useAdminMode'
import { useApp } from '../../context/AppContext'
import AdminSettingsModal from '../common/AdminSettingsModal'
import './Layout.css'

// 학생 모드에서 접근 가능한 경로 (내용 조회는 가능, 쓰기/수정은 isAdmin으로 각 페이지에서 통제)
const STUDENT_ALLOWED_PATHS = ['/', '/weekly', '/attendance', '/learning', '/calendar', '/tools', '/links', '/students'];

const NAV_ITEMS = [
  { path: '/', label: '대시보드', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg> },
  { path: '/weekly', label: '주간 일정', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /><path d="M8 14h.01" /><path d="M12 14h.01" /><path d="M16 14h.01" /><path d="M8 18h.01" /><path d="M12 18h.01" /><path d="M16 18h.01" /></svg> },
  { path: '/attendance', label: '출석 관리', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg> },
  { path: '/learning', label: '학습 관리', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg> },
  { path: '/calendar', label: '일정 & 공지', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg> },
  { path: '/tools', label: '학급 도구', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg> },
  { path: '/links', label: '바로가기', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg> },
  { path: '/students', label: '학생 관리', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg> },
];

const PAGE_TITLES = {
  '/': '대시보드',
  '/weekly': '주간 일정',
  '/attendance': '출석 관리',
  '/learning': '학습 관리',
  '/calendar': '일정 & 공지',
  '/tools': '학급 도구',
  '/links': '바로가기',
  '/students': '학생 관리',
};

const MOBILE_LABELS = {
  '/': '대시보드',
  '/weekly': '주간',
  '/attendance': '출석',
  '/learning': '학습',
  '/calendar': '일정',
  '/tools': '도구',
  '/links': '링크',
  '/students': '학생',
};

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdmin, showPinModal, setShowPinModal, emailInput, setEmailInput, passwordInput, setPasswordInput, login, toggle } = useAdminMode();
  const { showToast } = useApp();

  const pageTitle = PAGE_TITLES[location.pathname] || '대시보드';

  // 학습 관리, 투표(학급 도구) 등만 클릭 허용하고 나머지는 읽기 전용
  const isReadOnlyPath = !isAdmin && !STUDENT_ALLOWED_PATHS.includes(location.pathname);

  return (
    <div className="app-layout">
      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <span className="logo-icon">🏫</span>
            <div className="logo-text">
              <h1>하남중앙초등학교</h1>
              <span className="logo-sub">4학년 2반</span>
            </div>
          </div>
          <button className="sidebar-toggle" onClick={() => { setCollapsed(!collapsed); setSidebarOpen(false); }} aria-label="사이드바 토글">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
        </div>
        <nav className="sidebar-nav">
          {NAV_ITEMS.map(item => {
            const isAllowed = isAdmin || STUDENT_ALLOWED_PATHS.includes(item.path);
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''} ${!isAllowed ? 'nav-disabled' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
                {!isAllowed && <span className="nav-lock">🔒</span>}
              </NavLink>
            );
          })}
        </nav>
        <div className="sidebar-footer">
          <div className="teacher-profile">
            <div className="teacher-avatar">👩‍🏫</div>
            <div className="teacher-info">
              <span className="teacher-name">담임교사</span>
              <span className="teacher-role">김대붕 선생님</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="main-content">
        <header className="page-header">
          <button className="menu-btn" onClick={() => setSidebarOpen(true)} aria-label="메뉴">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
          </button>
          <div className="header-content">
            <h2 className="page-title">{pageTitle}</h2>
            <div className="header-actions">
              <span className="page-date">{formatDate(new Date())}</span>
              {isAdmin && (
                <button className="admin-btn settings-btn" onClick={() => setShowSettings(true)} aria-label="설정">
                  ⚙️
                </button>
              )}
              <button className={`admin-btn admin-toggle-btn ${isAdmin ? 'active' : ''}`} onClick={toggle} aria-label="관리자 모드">
                {isAdmin ? '🔓 선생님' : '🔒 학생'}
              </button>
            </div>
          </div>
        </header>
        <div className={`pages-container ${isReadOnlyPath ? 'student-read-only' : ''}`}>
          {children}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="mobile-nav">
        {NAV_ITEMS.map(item => {
          const isAllowed = isAdmin || STUDENT_ALLOWED_PATHS.includes(item.path);
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''} ${!isAllowed ? 'nav-disabled' : ''}`}
            >
              {item.icon}
              <span>{MOBILE_LABELS[item.path]}</span>
            </NavLink>
          );
        })}
      </nav>
      {/* Auth Modal */}
      {showPinModal && (
        <div className="modal-overlay" onMouseDown={e => { e.currentTarget._mouseDownTarget = e.target; }} onClick={e => { if (e.target === e.currentTarget && e.currentTarget._mouseDownTarget === e.currentTarget) setShowPinModal(false); }}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '350px' }}>
            <div className="modal-header">
              <h3>🔒 선생님 로그인</h3>
              <button className="close-btn" onClick={() => setShowPinModal(false)}>×</button>
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-light)' }}>이메일</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="teacher@school.com"
                  value={emailInput}
                  onChange={e => setEmailInput(e.target.value)}
                  autoFocus
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-light)' }}>비밀번호</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="비밀번호"
                  value={passwordInput}
                  onChange={e => setPasswordInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && login(emailInput, passwordInput)}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => login(emailInput, passwordInput)}>로그인</button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && isAdmin && (
        <AdminSettingsModal onClose={() => setShowSettings(false)} />
      )}
    </div>
  );
}
