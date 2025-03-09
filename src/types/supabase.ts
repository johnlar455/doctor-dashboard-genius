
import { Json } from "@/integrations/supabase/types";

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  department: string;
  email: string;
  phone: string;
  bio: string;
  avatar: string | null;
  created_at: string;
  availability: Json;
}

export const parseAvailability = (availability: Json): { start: string; end: string; days: string[] } => {
  try {
    if (typeof availability === 'object' && availability !== null) {
      return availability as { start: string; end: string; days: string[] };
    }
    
    if (typeof availability === 'string') {
      return JSON.parse(availability);
    }
    
    // Default fallback
    return {
      start: '09:00',
      end: '17:00',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    };
  } catch (e) {
    console.error('Error parsing doctor availability:', e);
    return {
      start: '09:00',
      end: '17:00',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    };
  }
};

export interface Patient {
  id: string;
  name: string;
  gender: string;
  age: number;
  email: string;
  phone: string;
  address?: string;
  date_of_birth: string;
  blood_type?: string;
  emergency_contact?: string;
  status: string;
  created_at: string;
  last_visit?: string;
}

export interface Appointment {
  id: string;
  doctor_id: string;
  patient_id: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  type: string;
  status: string;
  notes?: string;
  created_at: string;
}

export interface AppointmentData extends Appointment {
  doctors: Doctor;
  patients: Patient;
}

export interface DoctorSchedule {
  id: string;
  doctor_id: string;
  slot_date: string;
  start_time: string;
  end_time: string;
  status: string;
  patient_id?: string;
  created_at: string;
}
