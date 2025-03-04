
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
