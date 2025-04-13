
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, FileText, Plus } from 'lucide-react';
import { useHealthApp } from '@/contexts/HealthAppContext';
import { format, parseISO } from 'date-fns';

export default function Dashboard() {
  const { appointments, currentUser } = useHealthApp();
  
  // Get upcoming appointments
  const upcomingAppointments = appointments
    .filter(app => app.status === 'upcoming' && app.patientId === currentUser.id)
    .sort((a, b) => parseISO(a.startTime).getTime() - parseISO(b.startTime).getTime())
    .slice(0, 3);
  
  // Get recent past appointments
  const recentAppointments = appointments
    .filter(app => app.status === 'completed' && app.patientId === currentUser.id)
    .sort((a, b) => parseISO(b.startTime).getTime() - parseISO(a.startTime).getTime())
    .slice(0, 3);
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {currentUser.name}</h1>
          <p className="text-muted-foreground">Manage your appointments and health records</p>
        </div>
        
        <Button asChild>
          <Link to="/book">
            <Plus className="mr-2 h-4 w-4" /> Book New Appointment
          </Link>
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingAppointments.length}</div>
            <p className="text-xs text-muted-foreground">
              Your next appointment is{' '}
              {upcomingAppointments.length > 0 ? (
                <>on {format(parseISO(upcomingAppointments[0].startTime), 'MMMM d')}</>
              ) : (
                'not scheduled yet'
              )}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Visits</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentAppointments.length}</div>
            <p className="text-xs text-muted-foreground">
              Last visit was{' '}
              {recentAppointments.length > 0 ? (
                <>on {format(parseISO(recentAppointments[0].startTime), 'MMMM d')}</>
              ) : (
                'none yet'
              )}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prescriptions</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {appointments.filter(app => app.prescriptionUrl).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Available in your health records
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Upcoming Appointments</h2>
          <Button variant="outline" asChild>
            <Link to="/upcoming">View all</Link>
          </Button>
        </div>
        
        {upcomingAppointments.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {upcomingAppointments.map((appointment) => (
              <Card key={appointment.id} className="transition-transform hover:scale-[1.01]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{appointment.doctorName}</CardTitle>
                  <CardDescription>{appointment.doctorSpecialty}</CardDescription>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="flex justify-between mb-2">
                    <p className="text-muted-foreground">Date:</p>
                    <p className="font-medium">{format(parseISO(appointment.startTime), 'MMMM d, yyyy')}</p>
                  </div>
                  <div className="flex justify-between mb-2">
                    <p className="text-muted-foreground">Time:</p>
                    <p className="font-medium">{format(parseISO(appointment.startTime), 'h:mm a')}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-muted-foreground">Type:</p>
                    <p className="font-medium capitalize">{appointment.type}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-6 text-center">
              <p>No upcoming appointments</p>
              <Button className="mt-4" asChild>
                <Link to="/book">Book Now</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
