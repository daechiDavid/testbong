"use client";

import dynamic from 'next/dynamic';

const LinksPage = dynamic(() => import('../../views/LinksPage'), { ssr: false });

export default function Links() {
  return <LinksPage />;
}
