import { createContext, useContext, useReducer, useCallback, useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';

const AppContext = createContext(null);

function getWeekStart(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function toISODate(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

const initialState = {
  students: [],
  attendance: {},
  selectedAttendanceDate: toISODate(new Date()),
  monthlyAttendance: {},
  announcements: [],
  assignments: [],
  newsletters: [],
  polls: [],
  toasts: [],
  weeklyPlans: {},
  quickLinks: [],
  isAdmin: false,
  settings: {
    calendarId1: '',
    calendarId2: '',
    calendarId3: '',
    geminiApiKey: '',
    thermometerGoal: 1500,
    thermometerReward: '아이스크림 파티!'
  },
  ddays: [],
  activityCheck: {
    content: '오늘의 활동을 입력해주세요.',
    type: '수행평가',
    completions: {}
  },
  studentRecords: {},
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_STUDENTS': return { ...state, students: action.payload };
    case 'SET_ANNOUNCEMENTS': return { ...state, announcements: action.payload };
    case 'SET_ASSIGNMENTS': return { ...state, assignments: action.payload };
    case 'SET_ATTENDANCE_MAP': return { ...state, attendance: action.payload };
    case 'SET_SELECTED_ATTENDANCE_DATE': return { ...state, selectedAttendanceDate: action.payload };
    case 'SET_MONTHLY_ATTENDANCE': return { ...state, monthlyAttendance: action.payload };
    case 'SET_ATTENDANCE':
      return {
        ...state,
        attendance: {
          ...state.attendance,
          [action.payload.studentId]: { status: action.payload.status, note: action.payload.note || '' },
        },
      };
    case 'UPDATE_POINTS':
      return {
        ...state,
        students: state.students.map(s => s.id === action.payload.studentId ? { ...s, points: Math.max(0, s.points + action.payload.amount) } : s),
      };
    case 'RESET_POINTS':
      return {
        ...state,
        students: state.students.map(s => s.id === action.payload.studentId ? { ...s, points: 0 } : s),
      };
    case 'ADD_ANNOUNCEMENT': return { ...state, announcements: [action.payload, ...state.announcements] };
    case 'UPDATE_ANNOUNCEMENT': return { ...state, announcements: state.announcements.map(a => a.id === action.payload.id ? action.payload : a) };
    case 'DELETE_ANNOUNCEMENT': return { ...state, announcements: state.announcements.filter(a => a.id !== action.payload) };
    case 'ADD_ASSIGNMENT': return { ...state, assignments: [...state.assignments, action.payload] };
    case 'DELETE_ASSIGNMENT': return { ...state, assignments: state.assignments.filter(a => a.id !== action.payload) };
    case 'UPDATE_ASSIGNMENT_SUBMISSIONS':
      return {
        ...state,
        assignments: state.assignments.map(a => a.id === action.payload.id ? { ...a, submissions: { ...a.submissions, ...action.payload.submissions } } : a),
      };
    case 'EVALUATE_ASSIGNMENT':
      return {
        ...state,
        assignments: state.assignments.map(a => {
          if (a.id === action.payload.id) {
            const currentSub = a.submissions?.[action.payload.studentId] || {};
            return { ...a, submissions: { ...a.submissions, [action.payload.studentId]: { ...currentSub, grade: action.payload.grade } } };
          }
          return a;
        }),
      };
    case 'ADD_DDAY': return { ...state, ddays: [...state.ddays, action.payload] };
    case 'DELETE_DDAY': return { ...state, ddays: state.ddays.filter(d => d.id !== action.payload) };
    case 'SET_DDAYS': return { ...state, ddays: action.payload };
    case 'ADD_POLL': return { ...state, polls: [...state.polls, action.payload] };
    case 'DELETE_POLL': return { ...state, polls: state.polls.filter(p => p.id !== action.payload) };
    case 'SET_POLLS': return { ...state, polls: action.payload };
    case 'VOTE_POLL':
      return {
        ...state,
        polls: state.polls.map(p => p.id === action.payload.pollId ? { ...p, votes: action.payload.newVotes } : p),
      };
    case 'ADD_TOAST': return { ...state, toasts: [...state.toasts, action.payload] };
    case 'REMOVE_TOAST': return { ...state, toasts: state.toasts.filter(t => t.id !== action.payload) };
    case 'ADD_STUDENT': return { ...state, students: [...state.students, action.payload] };
    case 'UPDATE_STUDENT': return { ...state, students: state.students.map(s => s.id === action.payload.id ? { ...s, ...action.payload } : s) };
    case 'BULK_UPDATE_STUDENTS':
      return {
        ...state,
        students: state.students.map(s => {
          const update = action.payload.find(u => u.id === s.id);
          return update ? { ...s, ...update } : s;
        }),
      };
    case 'SET_NEWSLETTERS': return { ...state, newsletters: action.payload };
    case 'COLLECT_NEWSLETTER':
      return {
        ...state,
        newsletters: state.newsletters.map(n => n.id === action.payload.id ? { ...n, collected: action.payload.collected } : n),
      };
    case 'TOGGLE_ADMIN': return { ...state, isAdmin: action.payload };
    case 'UPDATE_SETTINGS': return { ...state, settings: { ...state.settings, ...action.payload } };
    case 'SET_WEEKLY_PLAN': {
      const { weekKey, day, period, subject, content } = action.payload;
      const existingWeek = state.weeklyPlans[weekKey] || {};
      return {
        ...state,
        weeklyPlans: {
          ...state.weeklyPlans,
          [weekKey]: {
            ...existingWeek,
            [day]: { ...(existingWeek[day] || {}), [period]: { subject, content } }
          }
        }
      };
    }
    case 'SET_WEEKLY_PLANS_BULK': return { ...state, weeklyPlans: action.payload };
    case 'SET_QUICK_LINKS': return { ...state, quickLinks: action.payload };
    case 'ADD_LINK': return { ...state, quickLinks: [...state.quickLinks, action.payload] };
    case 'UPDATE_LINK': return { ...state, quickLinks: state.quickLinks.map(l => l.id === action.payload.id ? action.payload : l) };
    case 'DELETE_LINK': return { ...state, quickLinks: state.quickLinks.filter(l => l.id !== action.payload) };
    case 'SET_ACTIVITY_CHECK': return { ...state, activityCheck: action.payload };
    case 'UPDATE_ACTIVITY_CONTENT':
      return {
        ...state,
        activityCheck: { ...state.activityCheck, content: action.payload.content, type: action.payload.type || state.activityCheck.type }
      };
    case 'MARK_ACTIVITY_COMPLETED':
      return {
        ...state,
        activityCheck: {
          ...state.activityCheck,
          completions: { ...state.activityCheck.completions, [action.payload.studentId]: { timestamp: action.payload.timestamp } }
        }
      };
    case 'CANCEL_ACTIVITY_COMPLETION': {
      const newComps = { ...state.activityCheck.completions };
      delete newComps[action.payload];
      return { ...state, activityCheck: { ...state.activityCheck, completions: newComps } };
    }
    case 'SET_STUDENT_RECORDS': return { ...state, studentRecords: action.payload };
    case 'ADD_STUDENT_RECORD': {
      const { studentId, record } = action.payload;
      const existing = state.studentRecords[studentId] || [];
      return { ...state, studentRecords: { ...state.studentRecords, [studentId]: [...existing, record] } };
    }
    case 'DELETE_STUDENT_RECORD': {
      const { studentId, recordId } = action.payload;
      const existing = state.studentRecords[studentId] || [];
      return { ...state, studentRecords: { ...state.studentRecords, [studentId]: existing.filter(r => r.id !== recordId) } };
    }
    default: return state;
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
          { data: assignments },
          { data: ddays },
          { data: weekly_plans },
          { data: app_configs },
          { data: quick_links },
          { data: polls },
          { data: newsletters },
          { data: activity_check },
          { data: activity_completions },
          { data: student_records }
        ] = await Promise.all([
          supabase.from('students').select('*').order('number', { ascending: true }),
          supabase.from('announcements').select('*').order('date', { ascending: false }),
          supabase.from('assignments').select('*').order('due_date', { ascending: true }),
          supabase.from('ddays').select('*').order('date', { ascending: true }),
          supabase.from('weekly_plans').select('*'),
          supabase.from('app_configs').select('*').single(),
          supabase.from('quick_links').select('*').order('id', { ascending: true }),
          supabase.from('polls').select('*').order('id', { ascending: true }),
          supabase.from('newsletters').select('*').order('date', { ascending: false }),
          supabase.from('activity_check').select('*').single(),
          supabase.from('activity_completions').select('*'),
          supabase.from('student_records').select('*').order('created_at', { ascending: false })
        ]);

        if (students) dispatch({ type: 'SET_STUDENTS', payload: students });
        if (announcements) dispatch({ type: 'SET_ANNOUNCEMENTS', payload: announcements });
        if (assignments) dispatch({ type: 'SET_ASSIGNMENTS', payload: assignments });
        
        if (ddays) dispatch({ type: 'SET_DDAYS', payload: ddays });
        if (quick_links) dispatch({ type: 'SET_QUICK_LINKS', payload: quick_links });
        if (polls) dispatch({ type: 'SET_POLLS', payload: polls });
        if (newsletters) dispatch({ type: 'SET_NEWSLETTERS', payload: newsletters });

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

        // 주간 계획 매핑
        if (weekly_plans) {
          const plansMap = {};
          weekly_plans.forEach(p => {
            if (!plansMap[p.week_key]) plansMap[p.week_key] = {};
            if (!plansMap[p.week_key][p.day]) plansMap[p.week_key][p.day] = {};
            plansMap[p.week_key][p.day][p.period] = { subject: p.subject, content: p.content };
          });
          dispatch({ type: 'SET_WEEKLY_PLANS_BULK', payload: plansMap });
        }

        // 활동 체크 매핑
        if (activity_check) {
          const comps = {};
          if (activity_completions) {
            activity_completions.forEach(c => { comps[c.student_id] = { timestamp: c.timestamp }; });
          }
          dispatch({ type: 'SET_ACTIVITY_CHECK', payload: { content: activity_check.content, type: activity_check.type, completions: comps } });
        }

        // 학생 기록 매핑
        if (student_records) {
          const recordsMap = {};
          student_records.forEach(r => {
            if (!recordsMap[r.student_id]) recordsMap[r.student_id] = [];
            recordsMap[r.student_id].push({
              id: r.id, type: r.type, content: r.content,
              date: r.created_at?.split('T')[0] || r.date, category: r.category || ''
            });
          });
          dispatch({ type: 'SET_STUDENT_RECORDS', payload: recordsMap });
        }

        // 설정 복원 (Supabase + LocalStorage)
        let mergedSettings = { ...initialState.settings };
        if (app_configs) {
          mergedSettings = { ...mergedSettings, ...app_configs };
        }
        try {
          const localSettings = localStorage.getItem('dashboardSettings');
          if (localSettings) {
            const parsed = JSON.parse(localSettings);
            mergedSettings.geminiApiKey = parsed.geminiApiKey || '';
          }
        } catch (e) {}
        dispatch({ type: 'UPDATE_SETTINGS', payload: mergedSettings });

        // Auth state listener
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session) dispatch({ type: 'TOGGLE_ADMIN', payload: true });
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

  // DB 연동 액션들
  const saveWeeklyPlan = useCallback(async (weekKey, day, period, subject, content) => {
    dispatch({ type: 'SET_WEEKLY_PLAN', payload: { weekKey, day, period, subject, content } });
    const { error } = await supabase.from('weekly_plans').upsert({
      week_key: weekKey, day, period, subject, content
    }, { onConflict: 'week_key, day, period' });
    if (error) console.error('Weekly plan save error:', error);
  }, []);

  const updateSettings = async (newSettings) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: newSettings });
    // LocalStorage 저장
    localStorage.setItem('dashboardSettings', JSON.stringify({ geminiApiKey: newSettings.geminiApiKey }));
    
    // DB 저장 (API 키 제외)
    const { geminiApiKey, ...dbSettings } = newSettings;
    await supabase.from('app_configs').upsert({ id: 1, ...dbSettings });
  };

  const addDDay = async (dday) => {
    const { data, error } = await supabase.from('ddays').insert({ name: dday.name, date: dday.date }).select();
    if (!error && data) dispatch({ type: 'ADD_DDAY', payload: data[0] });
  };

  const deleteDDay = async (id) => {
    dispatch({ type: 'DELETE_DDAY', payload: id });
    await supabase.from('ddays').delete().eq('id', id);
  };

  const updatePoints = async (studentId, currentPoints, amount) => {
    const newPoints = Math.max(0, currentPoints + amount);
    dispatch({ type: 'UPDATE_POINTS', payload: { studentId, amount } });
    await supabase.from('students').update({ points: newPoints }).eq('id', studentId);
  };

  const resetPoints = async (studentId) => {
    dispatch({ type: 'RESET_POINTS', payload: { studentId } });
    await supabase.from('students').update({ points: 0 }).eq('id', studentId);
  };

  const updateAttendance = async (studentId, status, note = '', date = null) => {
    const targetDate = date || new Date().toISOString().split('T')[0];
    dispatch({ type: 'SET_ATTENDANCE', payload: { studentId, status, note } });
    await supabase.from('attendance').delete().match({ student_id: studentId, date: targetDate });
    await supabase.from('attendance').insert({ student_id: studentId, date: targetDate, status, note });
  };

  const loadAttendanceByDate = async (date) => {
    dispatch({ type: 'SET_SELECTED_ATTENDANCE_DATE', payload: date });
    const { data: attendance } = await supabase.from('attendance').select('*').eq('date', date);
    const attMap = {};
    state.students.forEach(s => { attMap[s.id] = { status: 'present', note: '' }; });
    if (attendance) attendance.forEach(a => { attMap[a.student_id] = { status: a.status, note: a.note || '' }; });
    dispatch({ type: 'SET_ATTENDANCE_MAP', payload: attMap });
  };

  const loadMonthlyAttendance = async (year, month) => {
    const startDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;
    const endDate = `${year}-${String(month + 1).padStart(2, '0')}-${new Date(year, month + 1, 0).getDate()}`;
    const { data } = await supabase.from('attendance').select('*').gte('date', startDate).lte('date', endDate);
    const monthly = {};
    if (data) {
      data.forEach(a => {
        if (!monthly[a.date]) monthly[a.date] = {};
        monthly[a.date][a.student_id] = { status: a.status, note: a.note || '' };
      });
    }
    dispatch({ type: 'SET_MONTHLY_ATTENDANCE', payload: monthly });
  };

  const addStudentRecord = async (studentId, type, content, category = '') => {
    const record = { student_id: studentId, type, content, category, date: new Date().toISOString().split('T')[0] };
    const { data, error } = await supabase.from('student_records').insert(record).select();
    if (error) {
      showToast('기록 저장에 실패했습니다.', 'error');
    } else if (data && data[0]) {
      dispatch({ type: 'ADD_STUDENT_RECORD', payload: { studentId, record: { id: data[0].id, type, content, category, date: record.date } } });
      showToast('기록이 저장되었습니다.', 'success');
    }
  };

  const deleteStudentRecord = async (studentId, recordId) => {
    dispatch({ type: 'DELETE_STUDENT_RECORD', payload: { studentId, recordId } });
    await supabase.from('student_records').delete().eq('id', recordId);
  };

  const updateStudent = async (studentData) => {
    dispatch({ type: 'UPDATE_STUDENT', payload: studentData });
    const { id, ...updates } = studentData;
    await supabase.from('students').update(updates).eq('id', id);
  };

  const bulkUpdateStudents = async (updates) => {
    dispatch({ type: 'BULK_UPDATE_STUDENTS', payload: updates });
    for (const u of updates) {
      const { id, ...data } = u;
      await supabase.from('students').update(data).eq('id', id);
    }
  };

  // 새로 추가된 DB 액션들
  const votePoll = async (pollId, optionIndex) => {
    const poll = state.polls.find(p => p.id === pollId);
    if (!poll) return;
    const newVotes = [...poll.votes];
    newVotes[optionIndex] += 1;
    dispatch({ type: 'VOTE_POLL', payload: { pollId, newVotes } });
    await supabase.from('polls').update({ votes: newVotes }).eq('id', pollId);
  };

  const collectNewsletter = async (id, newCollected) => {
    dispatch({ type: 'COLLECT_NEWSLETTER', payload: { id, collected: newCollected } });
    await supabase.from('newsletters').update({ collected: newCollected }).eq('id', id);
  };

  const markActivityCompleted = async (studentId) => {
    const timestamp = new Date().toISOString();
    dispatch({ type: 'MARK_ACTIVITY_COMPLETED', payload: { studentId, timestamp } });
    await supabase.from('activity_completions').upsert({ student_id: studentId, timestamp });
  };

  const cancelActivityCompletion = async (studentId) => {
    dispatch({ type: 'CANCEL_ACTIVITY_COMPLETION', payload: studentId });
    await supabase.from('activity_completions').delete().eq('student_id', studentId);
  };

  const updateActivityContent = async (content, type) => {
    dispatch({ type: 'UPDATE_ACTIVITY_CONTENT', payload: { content, type } });
    await supabase.from('activity_check').upsert({ id: 1, content, type });
  };

  return (
    <AppContext.Provider value={{
      state, dispatch, showToast, updatePoints, resetPoints,
      updateAttendance, loadAttendanceByDate, loadMonthlyAttendance,
      updateStudent, bulkUpdateStudents, addStudentRecord, deleteStudentRecord,
      saveWeeklyPlan, updateSettings, addDDay, deleteDDay,
      votePoll, collectNewsletter, markActivityCompleted, cancelActivityCompletion, updateActivityContent,
      isDbLoading, getWeekStart, toISODate
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}

export { getWeekStart, toISODate };
