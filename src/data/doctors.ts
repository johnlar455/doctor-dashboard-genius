
import { format, addDays, addHours } from "date-fns";

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
    start: string; // Format: "09:00"
    end: string; // Format: "17:00"
    days: string[]; // ['monday', 'tuesday', etc.]
  };
  createdAt: Date;
}

export interface DoctorSchedule {
  doctorId: string;
  slots: {
    id: string;
    date: Date;
    start: string;
    end: string;
    status: "available" | "booked" | "unavailable";
    patientId?: string;
    patientName?: string;
  }[];
}

export const departments = [
  "Cardiology",
  "Neurology",
  "Pediatrics",
  "Orthopedics",
  "Dermatology",
  "Oncology",
  "Gynecology",
  "Ophthalmology",
  "Urology",
  "Psychiatry",
  "Radiology",
  "Emergency",
];

export const specialties = [
  "Cardiologist",
  "Neurologist",
  "Pediatrician",
  "Orthopedic Surgeon",
  "Dermatologist",
  "Oncologist",
  "Gynecologist",
  "Ophthalmologist",
  "Urologist",
  "Psychiatrist",
  "Radiologist",
  "Emergency Physician",
  "Family Medicine",
  "Internal Medicine",
  "General Surgeon",
  "Anesthesiologist",
  "Endocrinologist",
  "Gastroenterologist",
  "Hematologist",
  "Infectious Disease Specialist",
  "Nephrologist",
  "Pulmonologist",
  "Rheumatologist",
  "Sports Medicine",
];

export const mockDoctors: Doctor[] = [
  {
    id: "d1",
    name: "Dr. John Smith",
    avatar: "/placeholder.svg",
    specialty: "Cardiologist",
    department: "Cardiology",
    email: "john.smith@example.com",
    phone: "555-123-4567",
    bio: "Experienced cardiologist with over 15 years of practice in cardiac care.",
    availability: {
      start: "09:00",
      end: "17:00",
      days: ["monday", "tuesday", "wednesday", "thursday", "friday"],
    },
    createdAt: new Date("2023-01-15"),
  },
  {
    id: "d2",
    name: "Dr. Sarah Johnson",
    avatar: "/placeholder.svg",
    specialty: "Neurologist",
    department: "Neurology",
    email: "sarah.johnson@example.com",
    phone: "555-234-5678",
    bio: "Specializing in neurological disorders with a focus on stroke prevention and treatment.",
    availability: {
      start: "08:00",
      end: "16:00",
      days: ["monday", "wednesday", "friday"],
    },
    createdAt: new Date("2023-02-20"),
  },
  {
    id: "d3",
    name: "Dr. Michael Chen",
    avatar: "/placeholder.svg",
    specialty: "Pediatrician",
    department: "Pediatrics",
    email: "michael.chen@example.com",
    phone: "555-345-6789",
    bio: "Dedicated to providing compassionate care to children of all ages.",
    availability: {
      start: "10:00",
      end: "18:00",
      days: ["monday", "tuesday", "thursday", "friday"],
    },
    createdAt: new Date("2023-03-10"),
  },
  {
    id: "d4",
    name: "Dr. Emily Wilson",
    avatar: "/placeholder.svg",
    specialty: "Orthopedic Surgeon",
    department: "Orthopedics",
    email: "emily.wilson@example.com",
    phone: "555-456-7890",
    bio: "Specialized in joint replacement and sports injuries.",
    availability: {
      start: "08:30",
      end: "16:30",
      days: ["tuesday", "wednesday", "thursday"],
    },
    createdAt: new Date("2023-04-05"),
  },
  {
    id: "d5",
    name: "Dr. Robert Garcia",
    avatar: "/placeholder.svg",
    specialty: "Dermatologist",
    department: "Dermatology",
    email: "robert.garcia@example.com",
    phone: "555-567-8901",
    bio: "Board-certified dermatologist with expertise in skin cancer detection and treatment.",
    availability: {
      start: "09:30",
      end: "17:30",
      days: ["monday", "wednesday", "friday"],
    },
    createdAt: new Date("2023-05-12"),
  },
];

// Generate mock schedule data for doctors
export const generateMockSchedule = (doctorId: string): DoctorSchedule => {
  const today = new Date();
  const slots = [];

  // Generate slots for the next 7 days
  for (let day = 0; day < 7; day++) {
    const date = addDays(today, day);
    
    // Generate 8 slots per day (1 hour each)
    for (let hour = 0; hour < 8; hour++) {
      const slotDate = addHours(date, 9 + hour); // Start at 9 AM
      
      // Randomly assign slot status
      const statusOptions = ["available", "booked", "unavailable"];
      const statusProbs = [0.6, 0.3, 0.1]; // 60% available, 30% booked, 10% unavailable
      
      const randNum = Math.random();
      let statusIndex = 0;
      let cumProb = 0;
      
      for (let i = 0; i < statusProbs.length; i++) {
        cumProb += statusProbs[i];
        if (randNum <= cumProb) {
          statusIndex = i;
          break;
        }
      }
      
      const status = statusOptions[statusIndex] as "available" | "booked" | "unavailable";
      
      slots.push({
        id: `slot-${doctorId}-${format(slotDate, "yyyyMMddHHmm")}`,
        date: slotDate,
        start: format(slotDate, "HH:mm"),
        end: format(addHours(slotDate, 1), "HH:mm"),
        status,
        ...(status === "booked" ? {
          patientId: `p${Math.floor(Math.random() * 100)}`,
          patientName: `Patient ${Math.floor(Math.random() * 100)}`
        } : {})
      });
    }
  }

  return {
    doctorId,
    slots
  };
};

export const mockSchedules: Record<string, DoctorSchedule> = {};
mockDoctors.forEach(doctor => {
  mockSchedules[doctor.id] = generateMockSchedule(doctor.id);
});
