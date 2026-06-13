"use client";

import dynamic from 'next/dynamic';
import { AppProvider } from '../context/AppContext';

const Layout = dynamic(() => import('../components/layout/Layout'), { ssr: false });
const Toast = dynamic(() => import('../components/common/Toast'), { ssr: false });

export function Providers({ children }) {
  return (
    <AppProvider>
      <Layout>
        {children}
      </Layout>
      <Toast />
    </AppProvider>
  );
}
