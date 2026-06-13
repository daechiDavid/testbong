"use client";

import dynamic from 'next/dynamic';

const LearningPage = dynamic(() => import('../../views/LearningPage'), { ssr: false });

export default function Learning() {
  return <LearningPage />;
}
