"use client";

import dynamic from 'next/dynamic';

const CalendarPage = dynamic(() => import('../../views/CalendarPage'), { ssr: false });

export default function Calendar() {
  return <CalendarPage />;
}
