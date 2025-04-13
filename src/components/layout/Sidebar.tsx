
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, ClipboardList, Clock, UserCircle, FileText, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  isOpen: boolean;
}

export function Sidebar({ isOpen }: SidebarProps) {
  const location = useLocation();
  
  const navItems = [
    { 
      name: 'Dashboard', 
      path: '/', 
      icon: <Home className="h-5 w-5" /> 
    },
    { 
      name: 'Book Appointment', 
      path: '/book', 
      icon: <Calendar className="h-5 w-5" /> 
    },
    { 
      name: 'Upcoming Appointments', 
      path: '/upcoming', 
      icon: <Clock className="h-5 w-5" /> 
    },
    { 
      name: 'Past Appointments', 
      path: '/past', 
      icon: <ClipboardList className="h-5 w-5" /> 
    },
    { 
      name: 'Prescriptions', 
      path: '/prescriptions', 
      icon: <FileText className="h-5 w-5" /> 
    },
    { 
      name: 'Profile', 
      path: '/profile', 
      icon: <UserCircle className="h-5 w-5" /> 
    },
  ];
  
  return (
    <aside 
      className={cn(
        "fixed left-0 top-16 z-20 h-[calc(100vh-4rem)] w-64 border-r bg-background transition-transform duration-300 md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <nav className="flex flex-col gap-2 p-4">
        {navItems.map((item) => (
          <Button
            key={item.path}
            variant={location.pathname === item.path ? "secondary" : "ghost"}
            asChild
            className="justify-start"
          >
            <Link to={item.path} className="flex items-center gap-2">
              {item.icon}
              {item.name}
            </Link>
          </Button>
        ))}
      </nav>
    </aside>
  );
}
