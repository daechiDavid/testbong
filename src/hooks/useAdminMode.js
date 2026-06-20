import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { auth } from '../utils/firebase';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';

export function useAdminMode() {
  const { state, dispatch, showToast } = useApp();
  const { isAdmin } = state;
  const [showPinModal, setShowPinModal] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setShowPinModal(false);
      setEmailInput('');
      setPasswordInput('');
      showToast('교사 모드로 전환되었습니다.', 'success');
      dispatch({ type: 'TOGGLE_ADMIN', payload: true });
    } catch (error) {
      console.error('Login error:', error);
      showToast('이메일 또는 비밀번호가 틀렸습니다.', 'error');
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      dispatch({ type: 'TOGGLE_ADMIN', payload: false });
      showToast('학생 모드로 전환되었습니다.', 'info');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const toggle = () => {
    if (isAdmin) {
      logout();
    } else {
      setShowPinModal(true);
    }
  };

  return {
    isAdmin,
    showPinModal,
    setShowPinModal,
    emailInput,
    setEmailInput,
    passwordInput,
    setPasswordInput,
    login,
    logout,
    toggle
  };
}
