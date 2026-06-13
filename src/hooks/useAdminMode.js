import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { supabase } from '../utils/supabase';

export function useAdminMode() {
  const { state, dispatch, showToast } = useApp();
  const { isAdmin, settings } = state;
  const [showPinModal, setShowPinModal] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      showToast('이메일 또는 비밀번호가 틀렸습니다.', 'error');
    } else {
      setShowPinModal(false);
      setEmailInput('');
      setPasswordInput('');
      showToast('교사 모드로 전환되었습니다.', 'success');
      dispatch({ type: 'TOGGLE_ADMIN', payload: true });
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    dispatch({ type: 'TOGGLE_ADMIN', payload: false });
    showToast('학생 모드로 전환되었습니다.', 'info');
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
