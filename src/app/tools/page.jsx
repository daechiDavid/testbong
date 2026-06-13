"use client";

import dynamic from 'next/dynamic';

const ToolsPage = dynamic(() => import('../../views/ToolsPage'), { ssr: false });

export default function Tools() {
  return <ToolsPage />;
}
