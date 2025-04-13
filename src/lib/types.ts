
export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  imageUrl: string;
  clinicAddress?: string;
  offlineAvailable: boolean;
  onlineAvailable: boolean;
  rating: number;
  experience: number;
}

export interface TimeSlot {
  id: string;
  doctorId: string;
  startTime: string; // ISO string
  endTime: string; // ISO string
  isBooked: boolean;
}

export type AppointmentType = 'online' | 'offline';
export type OnlineConsultationType = 'text' | 'phone' | 'video';

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  startTime: string; // ISO string
  endTime: string; // ISO string
  type: AppointmentType;
  status: 'upcoming' | 'completed' | 'cancelled';
  onlineConsultationType?: OnlineConsultationType;
  notes: string;
  prescriptionUrl?: string;
  symptomImages?: string[];
  clinicAddress?: string;
}

export interface PatientProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  profileImageUrl?: string;
}
