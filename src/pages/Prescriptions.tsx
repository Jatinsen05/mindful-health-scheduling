
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Download, Search } from 'lucide-react';
import { useHealthApp } from '@/contexts/HealthAppContext';
import { format, parseISO } from 'date-fns';
import { Input } from '@/components/ui/input';

export default function Prescriptions() {
  const { appointments, currentUser } = useHealthApp();
  const [searchTerm, setSearchTerm] = React.useState('');
  
  // Get appointments with prescriptions
  const prescriptionAppointments = appointments
    .filter(app => 
      app.patientId === currentUser.id && 
      app.prescriptionUrl &&
      (searchTerm === '' || 
       app.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
       app.doctorSpecialty.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => parseISO(b.startTime).getTime() - parseISO(a.startTime).getTime());
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Prescriptions</h1>
        <p className="text-muted-foreground">Access and download your medical prescriptions</p>
      </div>
      
      <div className="flex items-center max-w-sm">
        <Input
          placeholder="Search prescriptions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
        <Button variant="ghost" size="icon">
          <Search className="h-4 w-4" />
        </Button>
      </div>
      
      {prescriptionAppointments.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {prescriptionAppointments.map((appointment) => (
            <Card key={appointment.id} className="transition-all hover:border-health-500">
              <CardHeader className="pb-3">
                <CardTitle>{appointment.doctorName}</CardTitle>
                <CardDescription>{appointment.doctorSpecialty}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center mb-4">
                  <Calendar className="h-4 w-4 mr-2 text-health-600" />
                  <span className="text-sm">{format(parseISO(appointment.startTime), 'MMMM d, yyyy')}</span>
                </div>
                
                <Button className="w-full" asChild>
                  <a 
                    href={appointment.prescriptionUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center"
                  >
                    <Download className="h-4 w-4 mr-2" /> 
                    Download Prescription
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-10 text-center">
            <h3 className="text-xl font-medium mb-2">No Prescriptions Found</h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm ? 'No prescriptions match your search' : "You don't have any prescriptions yet"}
            </p>
            {!searchTerm && (
              <Button asChild>
                <a href="/book">Book an Appointment</a>
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
