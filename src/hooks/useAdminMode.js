import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { auth } from '../utils/firebase';
import { signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from 'firebase/auth';

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
      
      // 만약 계정이 없어서 실패한 거라면 자동으로 회원가입 시도
      if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        try {
          await createUserWithEmailAndPassword(auth, email, password);
          setShowPinModal(false);
          setEmailInput('');
          setPasswordInput('');
          showToast('새 계정이 생성되었고 교사 모드로 전환되었습니다!', 'success');
          dispatch({ type: 'TOGGLE_ADMIN', payload: true });
        } catch (signupError) {
          console.error('Signup error:', signupError);
          if (signupError.code === 'auth/operation-not-allowed') {
            showToast('Firebase 콘솔에서 이메일 로그인을 먼저 켜주세요!', 'error');
          } else if (signupError.code === 'auth/weak-password') {
            showToast('비밀번호는 6자리 이상이어야 합니다.', 'error');
          } else {
            showToast('이메일/비밀번호를 다시 확인해주세요.', 'error');
          }
        }
      } else {
        showToast(`로그인 실패: ${error.message}`, 'error');
      }
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
