import { createContext, useContext, useReducer, useCallback, useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';
import { generateInitialAttendance, WEEKLY_PLANS, QUICK_LINKS } from '../data/mockData';

const AppContext = createContext(null);

const initialState = {
  students: [],
  attendance: {},
  announcements: [],
  assignments: [],
  newsletters: [],
  polls: [{
    id: 1,
    question: '현장체험학습 점심 메뉴 투표',
    options: ['도시락', '뷔페', '피자', '치킨'],
    votes: [8, 12, 5, 3],
    isActive: true,
  }],
  toasts: [],
  weeklyPlans: [...WEEKLY_PLANS],
  quickLinks: [...QUICK_LINKS],
  isAdmin: false,
  settings: {
    adminPin: '1234',
    thermometerGoal: 1500,
    calendarId: ''
  },
  activityCheck: {
    content: '오늘의 활동을 입력해주세요.',
    completions: {}
  }
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_STUDENTS':
      return { ...state, students: action.payload };
    case 'SET_ANNOUNCEMENTS':
      return { ...state, announcements: action.payload };
    case 'SET_ASSIGNMENTS':
      return { ...state, assignments: action.payload };
    case 'SET_ATTENDANCE_MAP':
      return { ...state, attendance: action.payload };
    case 'SET_ATTENDANCE':
      return {
        ...state,
        attendance: {
          ...state.attendance,
          [action.payload.studentId]: {
            status: action.payload.status,
            note: action.payload.note || '',
          },
        },
      };
    case 'UPDATE_POINTS':
      return {
        ...state,
        students: state.students.map(s =>
          s.id === action.payload.studentId
            ? { ...s, points: Math.max(0, s.points + action.payload.amount) }
            : s
        ),
      };
    case 'ADD_ANNOUNCEMENT':
      return {
        ...state,
        announcements: [action.payload, ...state.announcements],
      };
    case 'ADD_ASSIGNMENT':
      return {
        ...state,
        assignments: [...state.assignments, action.payload],
      };
    case 'UPDATE_ASSIGNMENT_SUBMISSION':
      return {
        ...state,
        assignments: state.assignments.map(a =>
          a.id === action.payload.id
            ? { ...a, submitted: action.payload.submitted }
            : a
        ),
      };
    case 'ADD_POLL':
      return {
        ...state,
        polls: [...state.polls, action.payload],
      };
    case 'VOTE_POLL':
      return {
        ...state,
        polls: state.polls.map(p =>
          p.id === action.payload.pollId
            ? {
                ...p,
                votes: p.votes.map((v, i) =>
                  i === action.payload.optionIndex ? v + 1 : v
                ),
              }
            : p
        ),
      };
    case 'ADD_TOAST':
      return {
        ...state,
        toasts: [...state.toasts, action.payload],
      };
    case 'REMOVE_TOAST':
      return {
        ...state,
        toasts: state.toasts.filter(t => t.id !== action.payload),
      };
    case 'ADD_STUDENT':
      return {
        ...state,
        students: [...state.students, action.payload],
      };
    case 'UPDATE_STUDENT':
      return {
        ...state,
        students: state.students.map(s =>
          s.id === action.payload.id ? { ...s, ...action.payload } : s
        ),
      };
    case 'COLLECT_NEWSLETTER':
      return {
        ...state,
        newsletters: state.newsletters.map(n =>
          n.id === action.payload
            ? { ...n, collected: Math.min(n.distributed, n.collected + 1) }
            : n
        ),
      };
    case 'TOGGLE_ADMIN':
      return { ...state, isAdmin: action.payload };
    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.payload } };
    case 'SET_WEEKLY_PLAN': {
      const { weekId, day, period, subject, content } = action.payload;
      return {
        ...state,
        weeklyPlans: state.weeklyPlans.map(wp => 
          wp.id === weekId 
            ? { 
                ...wp, 
                plans: { 
                  ...wp.plans, 
                  [day]: { 
                    ...wp.plans[day], 
                    [period]: { subject, content } 
                  } 
                } 
              }
            : wp
        )
      };
    }
    case 'ADD_LINK':
      return { ...state, quickLinks: [...state.quickLinks, action.payload] };
    case 'UPDATE_LINK':
      return { ...state, quickLinks: state.quickLinks.map(l => l.id === action.payload.id ? action.payload : l) };
    case 'DELETE_LINK':
      return { ...state, quickLinks: state.quickLinks.filter(l => l.id !== action.payload) };
    case 'UPDATE_ACTIVITY_CONTENT':
      return {
        ...state,
        activityCheck: {
          ...state.activityCheck,
          content: action.payload
        }
      };
    case 'MARK_ACTIVITY_COMPLETED':
      return {
        ...state,
        activityCheck: {
          ...state.activityCheck,
          completions: {
            ...state.activityCheck.completions,
            [action.payload.studentId]: { timestamp: action.payload.timestamp }
          }
        }
      };
    case 'CANCEL_ACTIVITY_COMPLETION': {
      const newComps = { ...state.activityCheck.completions };
      delete newComps[action.payload];
      return {
        ...state,
        activityCheck: {
          ...state.activityCheck,
          completions: newComps
        }
      };
    }
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isDbLoading, setIsDbLoading] = useState(true);

  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    dispatch({ type: 'ADD_TOAST', payload: { id, message, type } });
    setTimeout(() => dispatch({ type: 'REMOVE_TOAST', payload: id }), 3000);
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const [
          { data: students },
          { data: announcements },
          { data: assignments }
        ] = await Promise.all([
          supabase.from('students').select('*').order('number', { ascending: true }),
          supabase.from('announcements').select('*').order('date', { ascending: false }),
          supabase.from('assignments').select('*').order('due_date', { ascending: true })
        ]);

        if (students) dispatch({ type: 'SET_STUDENTS', payload: students });
        if (announcements) dispatch({ type: 'SET_ANNOUNCEMENTS', payload: announcements });
        if (assignments) dispatch({ type: 'SET_ASSIGNMENTS', payload: assignments });

        // 출석 초기값 (오늘)
        const today = new Date().toISOString().split('T')[0];
        const { data: attendance } = await supabase.from('attendance').select('*').eq('date', today);
        const attMap = {};
        if (students) {
          students.forEach(s => { attMap[s.id] = { status: 'present', note: '' }; });
        }
        if (attendance) {
          attendance.forEach(a => {
            attMap[a.student_id] = { status: a.status, note: a.note || '' };
          });
        }
        dispatch({ type: 'SET_ATTENDANCE_MAP', payload: attMap });

        // Auth state listener
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session) {
            dispatch({ type: 'TOGGLE_ADMIN', payload: true });
          }
        });

        supabase.auth.onAuthStateChange((_event, session) => {
          dispatch({ type: 'TOGGLE_ADMIN', payload: !!session });
        });

      } catch (err) {
        console.error('DB Fetch Error:', err);
        showToast('데이터베이스를 불러오는 데 실패했습니다.', 'error');
      } finally {
        setIsDbLoading(false);
      }
    }
    fetchData();
  }, [showToast]);

  // Async DB functions
  const updatePoints = async (studentId, currentPoints, amount) => {
    const newPoints = Math.max(0, currentPoints + amount);
    // Optimistic UI update
    dispatch({ type: 'UPDATE_POINTS', payload: { studentId, amount } });
    
    const { error } = await supabase
      .from('students')
      .update({ points: newPoints })
      .eq('id', studentId);
      
    if (error) {
      console.error('Point update failed', error);
      showToast('포인트 업데이트에 실패했습니다.', 'error');
      // Revert optimism if needed (ignoring for simple prototype)
    }
  };

  const updateAttendance = async (studentId, status, note = '') => {
    const today = new Date().toISOString().split('T')[0];
    dispatch({ type: 'SET_ATTENDANCE', payload: { studentId, status, note } });

    // UPSERT 로직 (id가 없으므로 delete 후 insert 하거나 다른 방법. 가장 쉬운건 삭제 후 삽입)
    await supabase.from('attendance').delete().match({ student_id: studentId, date: today });
    await supabase.from('attendance').insert({ student_id: studentId, date: today, status, note });
  };

  return (
    <AppContext.Provider value={{ state, dispatch, showToast, updatePoints, updateAttendance, isDbLoading }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
