
import { Doctor, TimeSlot, Appointment, PatientProfile } from './types';
import { addDays, format, addHours, parseISO, isAfter, isBefore, startOfToday } from 'date-fns';

// Create a current user
export const currentUser: PatientProfile = {
  id: 'patient1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '555-123-4567',
  profileImageUrl: 'https://randomuser.me/api/portraits/men/1.jpg',
};

// Create mock doctors
export const doctors: Doctor[] = [
  {
    id: 'doc1',
    name: 'Dr. Sarah Johnson',
    specialty: 'Cardiologist',
    imageUrl: 'https://randomuser.me/api/portraits/women/68.jpg',
    clinicAddress: '123 Medical Center Dr, Suite 101, Los Angeles, CA 90001',
    offlineAvailable: true,
    onlineAvailable: true,
    rating: 4.9,
    experience: 15,
  },
  {
    id: 'doc2',
    name: 'Dr. Michael Chen',
    specialty: 'Dermatologist',
    imageUrl: 'https://randomuser.me/api/portraits/men/22.jpg',
    clinicAddress: '456 Health Blvd, Room 203, San Francisco, CA 94101',
    offlineAvailable: true,
    onlineAvailable: true,
    rating: 4.7,
    experience: 10,
  },
  {
    id: 'doc3',
    name: 'Dr. Emily Rodriguez',
    specialty: 'Pediatrician',
    imageUrl: 'https://randomuser.me/api/portraits/women/45.jpg',
    clinicAddress: '789 Children's Way, New York, NY 10001',
    offlineAvailable: true,
    onlineAvailable: false,
    rating: 4.8,
    experience: 12,
  },
  {
    id: 'doc4',
    name: 'Dr. James Wilson',
    specialty: 'Neurologist',
    imageUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
    clinicAddress: '321 Brain Health Center, Chicago, IL 60601',
    offlineAvailable: true, 
    onlineAvailable: true,
    rating: 4.9,
    experience: 20,
  },
  {
    id: 'doc5',
    name: 'Dr. Lisa Patel',
    specialty: 'Psychiatrist',
    imageUrl: 'https://randomuser.me/api/portraits/women/33.jpg',
    offlineAvailable: false,
    onlineAvailable: true,
    rating: 4.6,
    experience: 8,
  },
];

// Generate time slots for the next 7 days
const generateTimeSlots = (): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const today = startOfToday();
  let slotId = 1;

  // For each doctor
  doctors.forEach(doctor => {
    // For each day (today + 7 days)
    for (let day = 0; day < 7; day++) {
      const currentDate = addDays(today, day);
      
      // Generate slots from 9 AM to 5 PM, 30 min each
      for (let hour = 9; hour < 17; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          const startTime = new Date(currentDate);
          startTime.setHours(hour, minute, 0, 0);
          
          const endTime = new Date(startTime);
          endTime.setMinutes(endTime.getMinutes() + 30);
          
          // Randomly mark some as booked (30% chance)
          const isBooked = Math.random() < 0.3;
          
          slots.push({
            id: `slot-${slotId++}`,
            doctorId: doctor.id,
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
            isBooked,
          });
        }
      }
    }
  });
  
  return slots;
};

export const timeSlots = generateTimeSlots();

// Generate some past and upcoming appointments
export const generateAppointments = (): Appointment[] => {
  const appointments: Appointment[] = [];
  const now = new Date();
  let appointmentId = 1;
  
  // Create 5 past appointments
  for (let i = 0; i < 5; i++) {
    const pastDate = addDays(now, -1 * (i + 1));
    const doctor = doctors[Math.floor(Math.random() * doctors.length)];
    
    appointments.push({
      id: `appointment-${appointmentId++}`,
      patientId: currentUser.id,
      doctorId: doctor.id,
      doctorName: doctor.name,
      doctorSpecialty: doctor.specialty,
      startTime: addHours(pastDate, 10).toISOString(),
      endTime: addHours(pastDate, 10.5).toISOString(),
      type: Math.random() > 0.5 ? 'offline' : 'online',
      status: 'completed',
      onlineConsultationType: Math.random() > 0.5 ? 'video' : 'text',
      notes: 'Past appointment notes. Patient reported symptoms of...',
      prescriptionUrl: 'https://example.com/prescription.pdf',
      clinicAddress: doctor.clinicAddress,
    });
  }
  
  // Create 3 upcoming appointments
  for (let i = 0; i < 3; i++) {
    const futureDate = addDays(now, i + 1);
    const doctor = doctors[Math.floor(Math.random() * doctors.length)];
    
    appointments.push({
      id: `appointment-${appointmentId++}`,
      patientId: currentUser.id,
      doctorId: doctor.id,
      doctorName: doctor.name,
      doctorSpecialty: doctor.specialty,
      startTime: addHours(futureDate, 14).toISOString(),
      endTime: addHours(futureDate, 14.5).toISOString(),
      type: Math.random() > 0.5 ? 'offline' : 'online',
      status: 'upcoming',
      onlineConsultationType: Math.random() > 0.5 ? 'phone' : 'video',
      notes: 'Looking forward to discuss the ongoing treatment...',
      clinicAddress: doctor.clinicAddress,
    });
  }
  
  return appointments;
};

export const appointments = generateAppointments();

// Helper functions for time slots
export const getAvailableSlotsForDoctor = (doctorId: string): TimeSlot[] => {
  const today = new Date();
  const oneWeekLater = addDays(today, 7);

  return timeSlots.filter(
    slot => 
      slot.doctorId === doctorId && 
      !slot.isBooked &&
      isAfter(parseISO(slot.startTime), today) &&
      isBefore(parseISO(slot.startTime), oneWeekLater)
  );
};

export const getUpcomingAppointments = (): Appointment[] => {
  const now = new Date();
  return appointments.filter(
    appointment => 
      appointment.patientId === currentUser.id && 
      appointment.status === 'upcoming' &&
      isAfter(parseISO(appointment.startTime), now)
  ).sort((a, b) => parseISO(a.startTime).getTime() - parseISO(b.startTime).getTime());
};

export const getPastAppointments = (): Appointment[] => {
  const now = new Date();
  return appointments.filter(
    appointment => 
      appointment.patientId === currentUser.id && 
      (appointment.status === 'completed' ||
       appointment.status === 'cancelled' ||
       isBefore(parseISO(appointment.endTime), now))
  ).sort((a, b) => parseISO(b.startTime).getTime() - parseISO(a.startTime).getTime());
};

export const getDoctorById = (id: string): Doctor | undefined => {
  return doctors.find(doctor => doctor.id === id);
};

export const searchDoctors = (
  query: string,
  specialty?: string
): Doctor[] => {
  const lowercaseQuery = query.toLowerCase();
  
  return doctors.filter(doctor => {
    const nameMatch = doctor.name.toLowerCase().includes(lowercaseQuery);
    const idMatch = doctor.id.toLowerCase().includes(lowercaseQuery);
    const specialtyMatch = !specialty || doctor.specialty.toLowerCase() === specialty.toLowerCase();
    
    return (nameMatch || idMatch) && specialtyMatch;
  });
};
