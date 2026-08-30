import React from 'react';
import Sidebar from './Sidebar';
import RightSidebar from './RightSidebar';

export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] text-[var(--text-primary)] relative">
      <Sidebar />

      <main className="relative z-10 pt-6">
        <div className="container mx-auto px-4 md:px-8 max-w-full">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">{children}</div>
            <RightSidebar />
          </div>
        </div>
      </main>
    </div>
  );
}
