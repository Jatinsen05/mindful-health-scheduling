
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { cn } from '@/lib/utils';

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} />
      
      <main className={cn(
        "flex-1 bg-background transition-all duration-300",
        "md:ml-64 md:pl-0",
        "pt-8 px-4 md:px-8"
      )}>
        <div className="container mx-auto max-w-7xl">
          <Outlet />
        </div>
      </main>
      
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 z-10 bg-black/50" 
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
}
