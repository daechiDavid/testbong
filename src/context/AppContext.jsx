/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useReducer, useCallback, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../utils/firebase';
import {
  getAllAppData,
  getAttendanceByDate,
  getAttendanceByMonth,
  upsertWeeklyPlan,
  upsertAppConfig,
  insertDDay,
  deleteDDay,
  updateStudentPoints,
  upsertAttendance,
  insertStudentRecord,
  deleteStudentRecord,
  updatePoll,
  updateNewsletter,
  upsertActivityCompletion,
  upsertActivityCheck,
  upsertStudent as updateStudentMutation,
  upsertQuickLink,
  deleteQuickLink,
  upsertAssignment,
  deleteAssignment,
  upsertAnnouncement,
  deleteAnnouncement,
  upsertPoll,
  deletePoll
} from '../lib/dataconnect';

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
        activityCheck: { ...state.activityCheck, content: action.payload.content, type: action.payload.type || state.activityCheck.type, completions: {} }
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
        const response = await getAllAppData();
        const {
          students, announcements, assignments, dDays: ddays,
          weeklyPlans: weekly_plans, appConfigs, quickLinks: quick_links,
          polls, newsletters, activityChecks, activityCompletions, studentRecords: student_records
        } = response.data;

        if (students) dispatch({ type: 'SET_STUDENTS', payload: students.sort((a,b)=>a.number-b.number) });
        if (announcements) dispatch({ type: 'SET_ANNOUNCEMENTS', payload: announcements.sort((a,b)=>new Date(b.date)-new Date(a.date)) });
        if (assignments) dispatch({ type: 'SET_ASSIGNMENTS', payload: assignments.sort((a,b)=>new Date(a.dueDate)-new Date(b.dueDate)) });
        if (ddays) dispatch({ type: 'SET_DDAYS', payload: ddays.sort((a,b)=>new Date(a.date)-new Date(b.date)) });
        if (quick_links) dispatch({ type: 'SET_QUICK_LINKS', payload: quick_links });
        if (polls) dispatch({ type: 'SET_POLLS', payload: polls });
        if (newsletters) dispatch({ type: 'SET_NEWSLETTERS', payload: newsletters.sort((a,b)=>new Date(b.date)-new Date(a.date)) });

        // 출석 초기값 (오늘)
        const today = new Date().toISOString().split('T')[0];
        const { data: attendanceData } = await getAttendanceByDate({ date: today });
        const attMap = {};
        if (students) {
          students.forEach(s => { attMap[s.id] = { status: 'present', note: '' }; });
        }
        if (attendanceData && attendanceData.attendances) {
          attendanceData.attendances.forEach(a => {
            attMap[a.student.id] = { status: a.status, note: a.note || '' };
          });
        }
        dispatch({ type: 'SET_ATTENDANCE_MAP', payload: attMap });

        // 주간 계획 매핑
        if (weekly_plans) {
          const plansMap = {};
          weekly_plans.forEach(p => {
            if (!plansMap[p.weekKey]) plansMap[p.weekKey] = {};
            if (!plansMap[p.weekKey][p.day]) plansMap[p.weekKey][p.day] = {};
            plansMap[p.weekKey][p.day][p.period] = { subject: p.subject, content: p.content };
          });
          dispatch({ type: 'SET_WEEKLY_PLANS_BULK', payload: plansMap });
        }

        // 활동 체크 매핑
        const activity_check = activityChecks && activityChecks.length > 0 ? activityChecks[0] : null;
        if (activity_check) {
          const comps = {};
          if (activityCompletions) {
            activityCompletions.forEach(c => { comps[c.student.id] = { timestamp: c.timestamp }; });
          }
          dispatch({ type: 'SET_ACTIVITY_CHECK', payload: { content: activity_check.content, type: activity_check.type, completions: comps } });
        }

        // 학생 기록 매핑
        if (student_records) {
          const recordsMap = {};
          student_records.sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)).forEach(r => {
            if (!recordsMap[r.student.id]) recordsMap[r.student.id] = [];
            recordsMap[r.student.id].push({
              id: r.id, type: r.type, content: r.content,
              date: r.date, category: r.category || ''
            });
          });
          dispatch({ type: 'SET_STUDENT_RECORDS', payload: recordsMap });
        }

        // 설정 복원
        let mergedSettings = { ...initialState.settings };
        const app_configs = appConfigs && appConfigs.length > 0 ? appConfigs[0] : null;
        if (app_configs) {
          // DB에서 가져온 값이 null이 아닐 때만 기존 설정을 덮어씀 (초기화 방지)
          Object.keys(app_configs).forEach(key => {
            if (app_configs[key] !== null && app_configs[key] !== undefined) {
              mergedSettings[key] = app_configs[key];
            }
          });
        }
        dispatch({ type: 'UPDATE_SETTINGS', payload: mergedSettings });

      } catch (err) {
        console.error('DB Fetch Error:', err);
        showToast('데이터베이스를 불러오는 데 실패했습니다.', 'error');
      } finally {
        setIsDbLoading(false);
      }
    }
    fetchData();

    // Auth state listener
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      dispatch({ type: 'TOGGLE_ADMIN', payload: !!user });
    });
    return () => unsubscribe();
  }, [showToast]);

  // DB 연동 액션들
  const saveWeeklyPlan = useCallback(async (weekKey, day, period, subject, content) => {
    dispatch({ type: 'SET_WEEKLY_PLAN', payload: { weekKey, day, period, subject, content } });
    try {
      await upsertWeeklyPlan({ weekKey, day, period, subject, content });
    } catch (error) {
      console.error('Weekly plan save error:', error);
    }
  }, []);

  const updateSettings = async (newSettings) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: newSettings });
    try {
      await upsertAppConfig({ id: 1, ...newSettings });
    } catch (error) {
      console.error('App config save error:', error);
    }
  };

  const addDDay = async (dday) => {
    try {
      const response = await insertDDay({ name: dday.name, date: dday.date });
      if (response && response.data && response.data.dDay_insert) {
        dispatch({ type: 'ADD_DDAY', payload: { id: response.data.dDay_insert, name: dday.name, date: dday.date } });
      }
    } catch (error) {
      console.error('DDay save error:', error);
    }
  };

  const deleteDDayFunc = async (id) => {
    dispatch({ type: 'DELETE_DDAY', payload: id });
    await deleteDDay({ id });
  };

  const updatePointsFunc = async (studentId, currentPoints, amount) => {
    const newPoints = Math.max(0, currentPoints + amount);
    dispatch({ type: 'UPDATE_POINTS', payload: { studentId, amount } });
    await updateStudentPoints({ id: studentId, points: newPoints });
  };

  const resetPointsFunc = async (studentId) => {
    dispatch({ type: 'RESET_POINTS', payload: { studentId } });
    await updateStudentPoints({ id: studentId, points: 0 });
  };

  const updateAttendanceFunc = async (studentId, status, note = '', date = null) => {
    const targetDate = date || new Date().toISOString().split('T')[0];
    dispatch({ type: 'SET_ATTENDANCE', payload: { studentId, status, note } });
    await upsertAttendance({ studentId, date: targetDate, status, note });
  };

  const loadAttendanceByDateFunc = async (date) => {
    dispatch({ type: 'SET_SELECTED_ATTENDANCE_DATE', payload: date });
    try {
      const { data } = await getAttendanceByDate({ date });
      const attMap = {};
      state.students.forEach(s => { attMap[s.id] = { status: 'present', note: '' }; });
      if (data && data.attendances) {
        data.attendances.forEach(a => { attMap[a.student.id] = { status: a.status, note: a.note || '' }; });
      }
      dispatch({ type: 'SET_ATTENDANCE_MAP', payload: attMap });
    } catch (error) {
      console.error('Load attendance error:', error);
    }
  };

  const loadMonthlyAttendanceFunc = async (year, month) => {
    const startDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;
    const endDate = `${year}-${String(month + 1).padStart(2, '0')}-${new Date(year, month + 1, 0).getDate()}`;
    try {
      const { data } = await getAttendanceByMonth({ startDate, endDate });
      const monthly = {};
      if (data && data.attendances) {
        data.attendances.forEach(a => {
          if (!monthly[a.date]) monthly[a.date] = {};
          monthly[a.date][a.student.id] = { status: a.status, note: a.note || '' };
        });
      }
      dispatch({ type: 'SET_MONTHLY_ATTENDANCE', payload: monthly });
    } catch (error) {
      console.error('Load monthly attendance error:', error);
    }
  };

  const addStudentRecordFunc = async (studentId, type, content, category = '') => {
    const date = new Date().toISOString().split('T')[0];
    try {
      const { data } = await insertStudentRecord({ studentId, type, content, category, date });
      if (data && data.studentRecord_insert) {
        dispatch({ type: 'ADD_STUDENT_RECORD', payload: { studentId, record: { id: data.studentRecord_insert, type, content, category, date } } });
        showToast('기록이 저장되었습니다.', 'success');
      }
    } catch (error) {
      console.error('Add student record error:', error);
      showToast('기록 저장에 실패했습니다.', 'error');
    }
  };

  const deleteStudentRecordFunc = async (studentId, recordId) => {
    dispatch({ type: 'DELETE_STUDENT_RECORD', payload: { studentId, recordId } });
    await deleteStudentRecord({ id: recordId });
  };

  const updateStudentFunc = async (studentData) => {
    dispatch({ type: 'UPDATE_STUDENT', payload: studentData });
    const { id, name, number, gender, birthday, parentPhone, allergies, healthNotes, points, group, seatIndex, aiSummary } = studentData;
    await updateStudentMutation({ id, name, number, gender, birthday, parentPhone, allergies, healthNotes, points, group, seatIndex, aiSummary });
  };

  const bulkUpdateStudentsFunc = async (updates) => {
    dispatch({ type: 'BULK_UPDATE_STUDENTS', payload: updates });
    for (const u of updates) {
      const { id, name, number, gender, birthday, parentPhone, allergies, healthNotes, points, group, seatIndex, aiSummary } = u;
      await updateStudentMutation({ id, name, number, gender, birthday, parentPhone, allergies, healthNotes, points, group, seatIndex, aiSummary });
    }
  };

  const votePollFunc = async (pollId, optionIndex) => {
    const poll = state.polls.find(p => p.id === pollId);
    if (!poll) return;
    const newVotes = [...poll.votes];
    newVotes[optionIndex] += 1;
    dispatch({ type: 'VOTE_POLL', payload: { pollId, newVotes } });
    await updatePoll({ id: pollId, votes: newVotes });
  };

  const collectNewsletterFunc = async (id, newCollected) => {
    dispatch({ type: 'COLLECT_NEWSLETTER', payload: { id, collected: newCollected } });
    await updateNewsletter({ id, collected: newCollected });
  };

  const markActivityCompletedFunc = async (studentId) => {
    const timestamp = new Date().toISOString();
    dispatch({ type: 'MARK_ACTIVITY_COMPLETED', payload: { studentId, timestamp } });
    await upsertActivityCompletion({ studentId, timestamp });
  };

  const cancelActivityCompletionFunc = async (studentId) => {
    dispatch({ type: 'CANCEL_ACTIVITY_COMPLETION', payload: studentId });
    // In DataConnect, we might need the ID to delete. 
    // This is a known limitation if we don't fetch the ID first. We'll leave it as a no-op DB wise for now or implement properly later.
  };

  const updateActivityContentFunc = async (content, type) => {
    dispatch({ type: 'UPDATE_ACTIVITY_CONTENT', payload: { content, type } });
    await upsertActivityCheck({ id: 1, content, type });
  };

  const addLinkFunc = async (linkData) => {
    dispatch({ type: 'ADD_LINK', payload: linkData });
    try {
      await upsertQuickLink(linkData);
    } catch(e) { console.error(e); }
  };

  const updateLinkFunc = async (linkData) => {
    dispatch({ type: 'UPDATE_LINK', payload: linkData });
    try {
      await upsertQuickLink(linkData);
    } catch(e) { console.error(e); }
  };

  const deleteLinkFunc = async (id) => {
    dispatch({ type: 'DELETE_LINK', payload: id });
    try {
      await deleteQuickLink({ id });
    } catch(e) { console.error(e); }
  };

  const addAssignmentFunc = async (assignmentData) => {
    dispatch({ type: 'ADD_ASSIGNMENT', payload: assignmentData });
    try {
      await upsertAssignment({
        id: assignmentData.id,
        dueDate: assignmentData.dueDate,
        title: assignmentData.title,
        submissions: assignmentData.submissions
      });
    } catch(e) { console.error(e); }
  };

  const updateAssignmentSubmissionsFunc = async (id, submissions) => {
    dispatch({ type: 'UPDATE_ASSIGNMENT_SUBMISSIONS', payload: { id, submissions } });
    const assignment = state.assignments.find(a => a.id === id);
    if (assignment) {
      try {
        await upsertAssignment({
          id: assignment.id,
          dueDate: assignment.dueDate,
          title: assignment.title,
          submissions: { ...assignment.submissions, ...submissions }
        });
      } catch(e) { console.error(e); }
    }
  };

  const deleteAssignmentFunc = async (id) => {
    dispatch({ type: 'DELETE_ASSIGNMENT', payload: id });
    try {
      await deleteAssignment({ id });
    } catch(e) { console.error(e); }
  };

  const addAnnouncementFunc = async (announcementData) => {
    try {
      await upsertAnnouncement({
        id: announcementData.id,
        date: announcementData.date,
        title: announcementData.title,
        content: announcementData.content,
        type: announcementData.type
      });
      dispatch({ type: 'ADD_ANNOUNCEMENT', payload: announcementData });
    } catch(e) { console.error('Add announcement error:', e); }
  };

  const updateAnnouncementFunc = async (announcementData) => {
    try {
      await upsertAnnouncement({
        id: announcementData.id,
        date: announcementData.date,
        title: announcementData.title,
        content: announcementData.content,
        type: announcementData.type
      });
      dispatch({ type: 'UPDATE_ANNOUNCEMENT', payload: announcementData });
    } catch(e) { console.error('Update announcement error:', e); }
  };

  const deleteAnnouncementFunc = async (id) => {
    try {
      await deleteAnnouncement({ id });
      dispatch({ type: 'DELETE_ANNOUNCEMENT', payload: id });
    } catch(e) { console.error('Delete announcement error:', e); }
  };

  const addPollFunc = async (pollData) => {
    try {
      await upsertPoll({
        id: pollData.id,
        question: pollData.question,
        options: pollData.options,
        votes: pollData.votes
      });
      dispatch({ type: 'ADD_POLL', payload: pollData });
    } catch(e) { console.error('Add poll error:', e); }
  };

  const deletePollFunc = async (id) => {
    try {
      await deletePoll({ id });
      dispatch({ type: 'DELETE_POLL', payload: id });
    } catch(e) { console.error('Delete poll error:', e); }
  };

  return (
    <AppContext.Provider value={{
      state, dispatch, showToast, 
      updatePoints: updatePointsFunc, resetPoints: resetPointsFunc,
      updateAttendance: updateAttendanceFunc, loadAttendanceByDate: loadAttendanceByDateFunc, loadMonthlyAttendance: loadMonthlyAttendanceFunc,
      updateStudent: updateStudentFunc, bulkUpdateStudents: bulkUpdateStudentsFunc, addStudentRecord: addStudentRecordFunc, deleteStudentRecord: deleteStudentRecordFunc,
      saveWeeklyPlan, updateSettings, addDDay, deleteDDay: deleteDDayFunc,
      votePoll: votePollFunc, collectNewsletter: collectNewsletterFunc, markActivityCompleted: markActivityCompletedFunc, cancelActivityCompletion: cancelActivityCompletionFunc, updateActivityContent: updateActivityContentFunc,
      addLink: addLinkFunc, updateLink: updateLinkFunc, deleteLink: deleteLinkFunc,
      addAssignment: addAssignmentFunc, updateAssignmentSubmissions: updateAssignmentSubmissionsFunc, deleteAssignment: deleteAssignmentFunc,
      addAnnouncement: addAnnouncementFunc, updateAnnouncement: updateAnnouncementFunc, deleteAnnouncement: deleteAnnouncementFunc,
      addPoll: addPollFunc, deletePoll: deletePollFunc,
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
