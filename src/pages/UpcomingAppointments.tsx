
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Video, Phone, MessageSquare } from 'lucide-react';
import { useHealthApp } from '@/contexts/HealthAppContext';
import { format, parseISO } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { OnlineConsultationType } from '@/lib/types';

export default function UpcomingAppointments() {
  const { appointments, currentUser } = useHealthApp();
  
  // Get upcoming appointments
  const upcomingAppointments = appointments
    .filter(app => app.status === 'upcoming' && app.patientId === currentUser.id)
    .sort((a, b) => parseISO(a.startTime).getTime() - parseISO(b.startTime).getTime());
  
  // Helper function to get icon for consultation type
  const getConsultationIcon = (type?: OnlineConsultationType) => {
    if (!type) return null;
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'phone': return <Phone className="h-4 w-4" />;
      case 'text': return <MessageSquare className="h-4 w-4" />;
      default: return null;
    }
  };
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Upcoming Appointments</h1>
        <p className="text-muted-foreground">View and manage your scheduled appointments</p>
      </div>
      
      {upcomingAppointments.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {upcomingAppointments.map((appointment) => (
            <Card key={appointment.id} className="transition-transform hover:scale-[1.01]">
              <CardHeader>
                <CardTitle className="text-xl">{appointment.doctorName}</CardTitle>
                <CardDescription className="flex justify-between items-center">
                  <span>{appointment.doctorSpecialty}</span>
                  <Badge variant="outline" className="capitalize">
                    {appointment.type}
                  </Badge>
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="flex items-start">
                  <Calendar className="h-4 w-4 mr-2 mt-0.5 text-health-600" />
                  <span>{format(parseISO(appointment.startTime), 'EEEE, MMMM d, yyyy')}</span>
                </div>
                
                <div className="flex items-start">
                  <Clock className="h-4 w-4 mr-2 mt-0.5 text-health-600" />
                  <span>{format(parseISO(appointment.startTime), 'h:mm a')} - {format(parseISO(appointment.endTime), 'h:mm a')}</span>
                </div>
                
                {appointment.type === 'offline' && appointment.clinicAddress && (
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 mr-2 mt-0.5 text-health-600" />
                    <span className="text-sm">{appointment.clinicAddress}</span>
                  </div>
                )}
                
                {appointment.type === 'online' && appointment.onlineConsultationType && (
                  <div className="flex items-center">
                    {getConsultationIcon(appointment.onlineConsultationType)}
                    <span className="ml-2 capitalize">
                      {appointment.onlineConsultationType} Consultation
                    </span>
                  </div>
                )}
                
                {appointment.notes && (
                  <div className="mt-2 pt-2 border-t">
                    <p className="text-sm text-muted-foreground">Notes:</p>
                    <p className="text-sm mt-1">{appointment.notes}</p>
                  </div>
                )}
              </CardContent>
              
              <CardFooter className="flex justify-between">
                <Button variant="outline">Reschedule</Button>
                <Button variant="destructive">Cancel</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-10 text-center">
            <h3 className="text-xl font-medium mb-2">No Upcoming Appointments</h3>
            <p className="text-muted-foreground mb-6">You don't have any scheduled appointments</p>
            <Button asChild>
              <a href="/book">Book an Appointment</a>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
