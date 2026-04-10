import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { AnimatePresence, motion } from 'framer-motion';

const AppLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex min-h-screen bg-background font-body relative text-on-surface transition-colors duration-500 overflow-x-hidden">
      
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSidebar}
            className="fixed inset-0 bg-background/60 backdrop-blur-sm z-[45] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar fixed to the left - Responsive behavior handled via classes */}
      <div className={`fixed inset-y-0 left-0 z-50 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <Sidebar onClose={closeSidebar} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col pl-0 lg:pl-64 transition-all duration-300 min-h-screen max-w-full">
        {/* Top Header universally applied */}
        <Topbar onMenuClick={toggleSidebar} />

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-3 md:p-4 lg:p-6 w-full relative">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
