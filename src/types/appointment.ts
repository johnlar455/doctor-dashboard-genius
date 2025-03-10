
import { AppointmentStatus } from "@/pages/Appointments";
import { Doctor, Patient } from "@/types/supabase";

// Define the type returned from the database
export interface AppointmentData {
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
  doctors?: Doctor;
  patients?: Patient;
}

// Update frontend appointment type
export interface Appointment {
  id: string;
  patientName: string;
  patientId: string;
  patientInitials: string;
  patientAvatar?: string | null;
  doctorName: string;
  doctorId: string;
  doctorAvatar?: string | null;
  doctorInitials: string;
  time: string;
  date: string;
  status: AppointmentStatus;
  type: string;
  notes: string;
}

// Utility function to convert database appointment to frontend appointment
export const mapDatabaseAppointmentToFrontend = (
  appointmentData: any,
  doctor?: Doctor,
  patient?: Patient
): Appointment => {
  // Extract initials
  const doctorInitials = doctor?.name
    ? doctor.name
        .split(' ')
        .map(part => part[0])
        .join('')
        .toUpperCase()
    : '';
    
  const patientInitials = patient?.name
    ? patient.name
        .split(' ')
        .map(part => part[0])
        .join('')
        .toUpperCase()
    : '';

  return {
    id: appointmentData.id,
    patientName: patient?.name || appointmentData.patients?.name || '',
    patientId: appointmentData.patient_id,
    patientInitials,
    patientAvatar: patient?.avatar || appointmentData.patients?.avatar || null,
    doctorName: doctor?.name || appointmentData.doctors?.name || '',
    doctorId: appointmentData.doctor_id,
    doctorAvatar: doctor?.avatar || appointmentData.doctors?.avatar || null,
    doctorInitials,
    time: appointmentData.start_time,
    date: appointmentData.appointment_date,
    status: appointmentData.status as AppointmentStatus,
    type: appointmentData.type,
    notes: appointmentData.notes || ""
  };
};

// Utility function to convert frontend appointment to database format
export const mapFrontendAppointmentToDatabase = (appointment: Appointment): Partial<AppointmentData> => {
  return {
    doctor_id: appointment.doctorId,
    patient_id: appointment.patientId,
    appointment_date: appointment.date,
    start_time: appointment.time,
    end_time: '', // This will be calculated in the component
    type: appointment.type,
    status: appointment.status,
    notes: appointment.notes
  };
};
