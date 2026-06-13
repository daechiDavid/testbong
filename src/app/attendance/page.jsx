"use client";

import dynamic from 'next/dynamic';

const AttendancePage = dynamic(() => import('../../views/AttendancePage'), { ssr: false });

export default function Attendance() {
  return <AttendancePage />;
}
