
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
