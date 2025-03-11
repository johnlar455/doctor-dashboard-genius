
import { Json } from "@/integrations/supabase/types";

export interface DoctorAvailability {
  start: string;
  end: string;
  days: string[];
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  department: string;
  email: string;
  phone: string;
  bio: string;
  avatar: string | null;
  availability: DoctorAvailability;
  created_at?: string;
}

// Convert from Supabase JSON to DoctorAvailability
export const parseDoctorAvailability = (availability: Json): DoctorAvailability => {
  if (typeof availability === 'string') {
    try {
      const parsed = JSON.parse(availability);
      return {
        start: parsed.start || '09:00',
        end: parsed.end || '17:00',
        days: parsed.days || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
      };
    } catch (e) {
      console.error('Error parsing doctor availability:', e);
    }
  } else if (typeof availability === 'object' && availability !== null) {
    return {
      start: (availability as any).start || '09:00',
      end: (availability as any).end || '17:00',
      days: (availability as any).days || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    };
  }
  
  // Return default values if parsing fails
  return {
    start: '09:00',
    end: '17:00',
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  };
};

// Serialize DoctorAvailability to JSON format for Supabase
export const serializeDoctorAvailability = (availability: DoctorAvailability): Json => {
  // Create a plain object that conforms to Json type
  return {
    start: availability.start,
    end: availability.end,
    days: availability.days
  };
};
