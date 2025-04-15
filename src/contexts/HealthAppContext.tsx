import React, { createContext, useContext, ReactNode, useState } from 'react';
import { 
  Doctor, 
  Appointment, 
  TimeSlot, 
  AppointmentType,
  OnlineConsultationType,
  PatientProfile 
} from '@/lib/types';
import { 
  doctors, 
  timeSlots, 
  appointments as mockAppointments, 
  currentUser as mockCurrentUser 
} from '@/lib/mockData';
import { format } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';

interface HealthAppContextType {
  doctors: Doctor[];
  timeSlots: TimeSlot[];
  appointments: Appointment[];
  currentUser: PatientProfile;
  filteredDoctors: Doctor[];
  selectedDoctor: Doctor | null;
  selectedSlot: TimeSlot | null;
  searchQuery: string;
  searchSpecialty: string;
  appointmentFormData: {
    type: AppointmentType;
    onlineConsultationType?: OnlineConsultationType;
    notes: string;
    images: string[];
    prescription: string | null;
  };
  searchDoctors: (query: string, specialty?: string) => void;
  selectDoctor: (doctor: Doctor) => void;
  selectTimeSlot: (slot: TimeSlot) => void;
  updateAppointmentForm: (data: Partial<HealthAppContextType['appointmentFormData']>) => void;
  bookAppointment: () => void;
  resetAppointmentForm: () => void;
}

const HealthAppContext = createContext<HealthAppContextType | undefined>(undefined);

export function HealthAppProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  
  // State
  const [currentUser, setCurrentUser] = useState<PatientProfile>(mockCurrentUser);
  const [allDoctors, setAllDoctors] = useState<Doctor[]>(doctors);
  const [allTimeSlots, setAllTimeSlots] = useState<TimeSlot[]>(timeSlots);
  const [allAppointments, setAllAppointments] = useState<Appointment[]>(mockAppointments);
  
  // UI State
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>(doctors);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSpecialty, setSearchSpecialty] = useState('');
  
  // Form State
  const [appointmentFormData, setAppointmentFormData] = useState({
    type: 'offline' as AppointmentType,
    onlineConsultationType: undefined as OnlineConsultationType | undefined,
    notes: '',
    images: [] as string[],
    prescription: null as string | null,
  });
  
  // Search doctors by name, id, or specialty
  const searchDoctors = (query: string, specialty?: string) => {
    setSearchQuery(query);
    if (specialty) setSearchSpecialty(specialty);
    
    const lowercaseQuery = query.toLowerCase();
    
    const filtered = allDoctors.filter(doctor => {
      if (specialty) {
        return doctor.specialty.toLowerCase() === specialty.toLowerCase();
      }
      
      const nameMatch = doctor.name.toLowerCase().includes(lowercaseQuery);
      const idMatch = doctor.id.toLowerCase().includes(lowercaseQuery);
      
      return nameMatch || idMatch;
    });
    
    setFilteredDoctors(filtered);
  };
  
  // Select a doctor
  const selectDoctor = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setSelectedSlot(null);
  };
  
  // Select a time slot
  const selectTimeSlot = (slot: TimeSlot) => {
    setSelectedSlot(slot);
  };
  
  // Update appointment form data
  const updateAppointmentForm = (data: Partial<HealthAppContextType['appointmentFormData']>) => {
    setAppointmentFormData(prev => ({
      ...prev,
      ...data
    }));
  };
  
  // Book an appointment
  const bookAppointment = () => {
    if (!selectedDoctor || !selectedSlot) {
      toast({
        title: "Booking Failed",
        description: "Please select a doctor and time slot.",
        variant: "destructive"
      });
      return;
    }
    
    // Create a new appointment
    const newAppointment: Appointment = {
      id: `appointment-${Date.now()}`,
      patientId: currentUser.id,
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      doctorSpecialty: selectedDoctor.specialty,
      startTime: selectedSlot.startTime,
      endTime: selectedSlot.endTime,
      type: appointmentFormData.type,
      status: 'upcoming',
      onlineConsultationType: appointmentFormData.onlineConsultationType,
      notes: appointmentFormData.notes,
      prescriptionUrl: appointmentFormData.prescription || undefined,
      symptomImages: appointmentFormData.images.length > 0 ? appointmentFormData.images : undefined,
      clinicAddress: selectedDoctor.clinicAddress,
    };
    
    // Mark the slot as booked
    const updatedSlots = allTimeSlots.map(slot => 
      slot.id === selectedSlot.id ? { ...slot, isBooked: true } : slot
    );
    
    setAllAppointments([...allAppointments, newAppointment]);
    setAllTimeSlots(updatedSlots);
    
    toast({
      title: "Appointment Booked!",
      description: `Your appointment with ${selectedDoctor.name} on ${format(new Date(selectedSlot.startTime), 'PPP')} at ${format(new Date(selectedSlot.startTime), 'p')} has been confirmed.`,
    });
    
    resetAppointmentForm();
  };
  
  // Reset the appointment form
  const resetAppointmentForm = () => {
    setSelectedDoctor(null);
    setSelectedSlot(null);
    setAppointmentFormData({
      type: 'offline',
      onlineConsultationType: undefined,
      notes: '',
      images: [],
      prescription: null,
    });
  };
  
  const value = {
    doctors: allDoctors,
    timeSlots: allTimeSlots,
    appointments: allAppointments,
    currentUser,
    filteredDoctors,
    selectedDoctor,
    selectedSlot,
    searchQuery,
    searchSpecialty,
    appointmentFormData,
    searchDoctors,
    selectDoctor,
    selectTimeSlot,
    updateAppointmentForm,
    bookAppointment,
    resetAppointmentForm,
  };
  
  return (
    <HealthAppContext.Provider value={value}>
      {children}
    </HealthAppContext.Provider>
  );
}

export function useHealthApp() {
  const context = useContext(HealthAppContext);
  if (context === undefined) {
    throw new Error('useHealthApp must be used within a HealthAppProvider');
  }
  return context;
}
