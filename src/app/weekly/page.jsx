"use client";

import dynamic from 'next/dynamic';

const WeeklyPlanPage = dynamic(() => import('../../views/WeeklyPlanPage'), { ssr: false });

export default function Weekly() {
  return <WeeklyPlanPage />;
}
