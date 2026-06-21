const DAYS_KR = ['일', '월', '화', '수', '목', '금', '토'];

export function getDayName(date = new Date()) {
  return DAYS_KR[date.getDay()];
}

export function formatDate(date, format = 'full') {
  const d = typeof date === 'string' ? new Date(date) : date;
  const y = d.getFullYear();
  const m = d.getMonth() + 1;
  const day = d.getDate();
  const dow = DAYS_KR[d.getDay()];

  switch (format) {
    case 'full': return `${y}년 ${m}월 ${day}일 (${dow})`;
    case 'short': return `${m}/${day} (${dow})`;
    case 'month': return `${y}년 ${m}월`;
    case 'iso': return `${y}-${String(m).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    default: return `${m}월 ${day}일`;
  }
}

export function getDday(targetDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(targetDate);
  target.setHours(0, 0, 0, 0);
  const diff = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
  if (diff === 0) return 'D-Day';
  if (diff > 0) return `D-${diff}`;
  return `D+${Math.abs(diff)}`;
}

export function isSameDay(d1, d2) {
  const a = new Date(d1);
  const b = new Date(d2);
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function isTodayBirthday(birthday) {
  const today = new Date();
  const bd = new Date(birthday);
  return today.getMonth() === bd.getMonth() && today.getDate() === bd.getDate();
}

export function getAvatarColor(id) {
  const colors = ['c1','c2','c3','c4','c5','c6','c7','c8'];
  
  // 1. id가 숫자형(Index)일 경우 기존 방식대로 인덱스 연산을 수행합니다.
  if (typeof id === 'number') {
    return colors[(id - 1) % colors.length];
  }
  
  // 2. id가 UUID 등의 문자열(String)일 경우, 각 문자의 아스키 코드 합을 구하여 고유한 색상 인덱스를 추출합니다.
  if (typeof id === 'string') {
    let sum = 0;
    for (let i = 0; i < id.length; i++) {
      sum += id.charCodeAt(i);
    }
    return colors[sum % colors.length];
  }
  
  // 3. 예외적인 경우(id가 없을 때 등)에는 기본적으로 첫 번째 색상을 적용합니다.
  return colors[0];
}

export function getInitials(name) {
  return name.slice(0, 1);
}

export function getCurrentPeriod() {
  const now = new Date();
  const h = now.getHours();
  const m = now.getMinutes();
  const time = h * 60 + m;
  const periods = [
    { p: 1, start: 540, end: 580 },
    { p: 2, start: 590, end: 630 },
    { p: 3, start: 640, end: 680 },
    { p: 4, start: 690, end: 730 },
    { p: 5, start: 790, end: 830 },
    { p: 6, start: 840, end: 880 },
  ];
  const found = periods.find(p => time >= p.start && time <= p.end);
  return found ? found.p : null;
}

export function getCalendarDays(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDow = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const days = [];

  // Previous month padding
  const prevMonthLast = new Date(year, month, 0).getDate();
  for (let i = startDow - 1; i >= 0; i--) {
    days.push({ day: prevMonthLast - i, currentMonth: false, date: new Date(year, month - 1, prevMonthLast - i) });
  }

  // Current month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({ day: i, currentMonth: true, date: new Date(year, month, i) });
  }

  // Next month padding
  const remaining = 42 - days.length;
  for (let i = 1; i <= remaining; i++) {
    days.push({ day: i, currentMonth: false, date: new Date(year, month + 1, i) });
  }

  return days;
}

export function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
