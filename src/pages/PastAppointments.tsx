
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, FileText } from 'lucide-react';
import { useHealthApp } from '@/contexts/HealthAppContext';
import { format, parseISO } from 'date-fns';
import { Badge } from '@/components/ui/badge';

export default function PastAppointments() {
  const { appointments, currentUser } = useHealthApp();
  
  // Get past appointments
  const pastAppointments = appointments
    .filter(app => app.status === 'completed' && app.patientId === currentUser.id)
    .sort((a, b) => parseISO(b.startTime).getTime() - parseISO(a.startTime).getTime());
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Past Appointments</h1>
        <p className="text-muted-foreground">View your appointment history</p>
      </div>
      
      {pastAppointments.length > 0 ? (
        <div className="space-y-6">
          {pastAppointments.map((appointment) => (
            <Card key={appointment.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{appointment.doctorName}</CardTitle>
                    <CardDescription>{appointment.doctorSpecialty}</CardDescription>
                  </div>
                  <Badge variant={appointment.type === 'online' ? 'secondary' : 'outline'} className="capitalize">
                    {appointment.type} {appointment.onlineConsultationType ? `(${appointment.onlineConsultationType})` : ''}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-health-600" />
                    <span>{format(parseISO(appointment.startTime), 'MMMM d, yyyy')}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-health-600" />
                    <span>{format(parseISO(appointment.startTime), 'h:mm a')} - {format(parseISO(appointment.endTime), 'h:mm a')}</span>
                  </div>
                </div>
                
                {appointment.notes && (
                  <div className="mt-2">
                    <h4 className="text-sm font-medium mb-1">Notes</h4>
                    <p className="text-sm text-muted-foreground">{appointment.notes}</p>
                  </div>
                )}
                
                <div className="flex justify-between items-center pt-2">
                  {appointment.prescriptionUrl ? (
                    <Button variant="outline" className="flex items-center" asChild>
                      <a href={appointment.prescriptionUrl} target="_blank" rel="noopener noreferrer">
                        <FileText className="h-4 w-4 mr-2" /> View Prescription
                      </a>
                    </Button>
                  ) : (
                    <span className="text-sm text-muted-foreground">No prescription attached</span>
                  )}
                  
                  <Button>Book Follow-up</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-10 text-center">
            <h3 className="text-xl font-medium mb-2">No Past Appointments</h3>
            <p className="text-muted-foreground mb-6">You don't have any completed appointments</p>
            <Button asChild>
              <a href="/book">Book Your First Appointment</a>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
