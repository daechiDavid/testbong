import { useState } from 'react';
import { useApp } from '../context/AppContext';

export function useAdminMode() {
  const { state, dispatch, showToast } = useApp();
  const { isAdmin, settings } = state;
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');

  const login = (pin) => {
    if (pin === settings.adminPin) {
      dispatch({ type: 'TOGGLE_ADMIN', payload: true });
      setShowPinModal(false);
      setPinInput('');
      showToast('관리자 모드로 전환되었습니다.', 'success');
    } else {
      showToast('비밀번호가 틀렸습니다.', 'error');
    }
  };

  const logout = () => {
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
    pinInput, 
    setPinInput, 
    login, 
    logout, 
    toggle 
  };
}
