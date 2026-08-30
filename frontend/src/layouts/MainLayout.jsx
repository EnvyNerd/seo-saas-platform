import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { Header } from '../components/ui';

const MainLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-surface-primary text-text-primary overflow-hidden transition-colors duration-300">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-40 bg-slate-950/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <Sidebar open={sidebarOpen} onNavigate={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header 
          className="shrink-0"
          isMenuOpen={sidebarOpen}
          onMenuToggle={() => setSidebarOpen((open) => !open)}
          logo={
            <div className="md:hidden font-display font-bold text-xl text-slb-blue-500">
              VISIORAX PROJECT
            </div>
          }
        />
        
        <main className="flex-1 overflow-auto bg-surface-primary relative">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
