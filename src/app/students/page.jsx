"use client";

import dynamic from 'next/dynamic';

const StudentsPage = dynamic(() => import('../../views/StudentsPage'), { ssr: false });

export default function Students() {
  return <StudentsPage />;
}
