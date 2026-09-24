'use client';

import * as React from 'react';
import { Sidebar } from '@/components/navigation/sidebar';
import { Header } from '@/components/navigation/header';
import { Breadcrumbs } from '@/components/navigation/breadcrumbs';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-on-surface flex">
      {/* Fixed Left Sidebar */}
      <Sidebar />

      {/* Main Canvas Area */}
      <div className="pl-60 w-full flex flex-col min-h-screen">
        {/* Sticky Top Header */}
        <Header />

        {/* Dynamic Workspace Canvas */}
        <main className="p-margin space-y-space-lg flex-1">
          <Breadcrumbs />
          {children}
        </main>
      </div>
    </div>
  );
}
