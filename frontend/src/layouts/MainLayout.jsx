import React from 'react';
import Sidebar from '../components/Sidebar';
import { Header } from '../components/ui';

const MainLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-surface-primary text-text-primary overflow-hidden transition-colors duration-300">
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header 
          className="shrink-0"
          logo={
            <div className="md:hidden font-display font-bold text-xl text-slb-blue-500">
              SaaS
            </div>
          }
        />
        
        <main className="flex-1 overflow-auto bg-surface-primary relative">
          {/* Main Content */}
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
