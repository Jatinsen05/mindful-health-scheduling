
import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, User, Calendar, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useHealthApp } from '@/contexts/HealthAppContext';

interface HeaderProps {
  toggleSidebar: () => void;
}

export function Header({ toggleSidebar }: HeaderProps) {
  const { currentUser } = useHealthApp();
  
  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleSidebar}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
          
          <Link to="/" className="flex items-center space-x-2">
            <span className="h-8 w-8 bg-health-600 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="h-5 w-5">
                <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path>
              </svg>
            </span>
            <span className="font-bold text-xl text-health-700">HealthHub</span>
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/book" className="text-sm font-medium transition-colors hover:text-primary">
              Book Appointment
            </Link>
            <Link to="/upcoming" className="text-sm font-medium transition-colors hover:text-primary">
              Upcoming
            </Link>
            <Link to="/past" className="text-sm font-medium transition-colors hover:text-primary">
              Past Appointments
            </Link>
            <Link to="/prescriptions" className="text-sm font-medium transition-colors hover:text-primary">
              Prescriptions
            </Link>
          </nav>
          
          <Button variant="ghost" size="icon" asChild className="relative">
            <Link to="/notifications">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full" />
              <span className="sr-only">Notifications</span>
            </Link>
          </Button>
          
          <Link to="/profile" className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={currentUser.profileImageUrl} alt={currentUser.name} />
              <AvatarFallback>{currentUser.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </div>
    </header>
  );
}
