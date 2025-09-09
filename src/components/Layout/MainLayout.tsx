import React from 'react';
import Sidebar from './Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-purple-900/20 dark:to-blue-900/20 overflow-hidden">
      <Sidebar />
      <main className="flex-1 lg:ml-64 overflow-hidden">
        <div className="h-full overflow-y-auto overflow-x-hidden p-4 lg:p-6 touch-pan-y" style={{ WebkitOverflowScrolling: 'touch' }}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;