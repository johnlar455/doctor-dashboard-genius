
export interface Doctor {
  id: string;
  name: string;
  avatar?: string;
  specialty: string;
  department: string;
  email: string;
  phone: string;
  bio: string;
  availability: {
    start: string;
    end: string;
    days: string[];
  };
  created_at: string;
}

export interface DoctorSchedule {
  id: string;
  doctor_id: string;
  slot_date: string;
  start_time: string;
  end_time: string;
  status: "available" | "booked" | "unavailable";
  patient_id?: string;
  created_at: string;
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  date_of_birth: string;
  age: number;
  blood_type?: string;
  address?: string;
  emergency_contact?: string;
  last_visit?: string;
  status: string;
  created_at: string;
}

export interface MedicalRecord {
  id: string;
  patient_id: string;
  type: string;
  description: string;
  date: string;
  prescriptions?: string[];
  created_at: string;
}

export interface DoctorFeedback {
  id: string;
  doctor_id: string;
  patient_id: string;
  punctuality: number;
  knowledge: number;
  communication: number;
  friendliness: number;
  overall: number;
  comments?: string;
  created_at: string;
}
