
export interface PatientData {
  id: string;
  name: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  bloodType: string;
  emergencyContact: string;
  status: "Active" | "Inactive";
  lastVisit: string;
}

export interface MedicalRecord {
  patientId: string;
  date: string;
  type: string;
  description: string;
  prescriptions?: string[];
}

export interface PatientAppointment {
  patientId: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  type: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  notes?: string;
}

// Mock Patients Data
export const mockPatients: PatientData[] = [
  {
    id: "P-001",
    name: "Jane Cooper",
    age: 42,
    gender: "Female",
    email: "jane.cooper@example.com",
    phone: "(555) 123-4567",
    address: "123 Main St, Anytown, CA 12345",
    dateOfBirth: "1981-05-15",
    bloodType: "O+",
    emergencyContact: "John Cooper (Husband) - (555) 987-6543",
    status: "Active",
    lastVisit: "Oct 12, 2023"
  },
  {
    id: "P-002",
    name: "Robert Fox",
    age: 35,
    gender: "Male",
    email: "robert.fox@example.com",
    phone: "(555) 234-5678",
    address: "456 Oak Ave, Somewhere, CA 54321",
    dateOfBirth: "1988-09-22",
    bloodType: "A-",
    emergencyContact: "Mary Fox (Wife) - (555) 876-5432",
    status: "Active",
    lastVisit: "Nov 05, 2023"
  },
  {
    id: "P-003",
    name: "Esther Howard",
    age: 68,
    gender: "Female",
    email: "esther.howard@example.com",
    phone: "(555) 345-6789",
    address: "789 Pine Ln, Elsewhere, CA 98765",
    dateOfBirth: "1955-03-10",
    bloodType: "AB+",
    emergencyContact: "Michael Howard (Son) - (555) 765-4321",
    status: "Inactive",
    lastVisit: "Aug 27, 2023"
  },
  {
    id: "P-004",
    name: "Cody Fisher",
    age: 29,
    gender: "Male",
    email: "cody.fisher@example.com",
    phone: "(555) 456-7890",
    address: "321 Cedar St, Nowhere, CA 34567",
    dateOfBirth: "1994-12-05",
    bloodType: "B+",
    emergencyContact: "Lisa Fisher (Sister) - (555) 654-3210",
    status: "Active",
    lastVisit: "Dec 03, 2023"
  },
  {
    id: "P-005",
    name: "Brooklyn Simmons",
    age: 51,
    gender: "Female",
    email: "brooklyn.simmons@example.com",
    phone: "(555) 567-8901",
    address: "654 Maple Dr, Anyplace, CA 67890",
    dateOfBirth: "1972-07-18",
    bloodType: "O-",
    emergencyContact: "David Simmons (Husband) - (555) 543-2109",
    status: "Active",
    lastVisit: "Jan 15, 2024"
  },
  {
    id: "P-006",
    name: "Leslie Alexander",
    age: 33,
    gender: "Female",
    email: "leslie.alexander@example.com",
    phone: "(555) 678-9012",
    address: "987 Birch Blvd, Someplace, CA 43210",
    dateOfBirth: "1990-11-30",
    bloodType: "A+",
    emergencyContact: "Mark Alexander (Brother) - (555) 432-1098",
    status: "Inactive",
    lastVisit: "Sep 08, 2023"
  }
];

// Mock Medical Records
export const mockMedicalRecords: MedicalRecord[] = [
  {
    patientId: "P-001",
    date: "Oct 12, 2023",
    type: "Annual Physical",
    description: "Patient is in good overall health. Blood pressure slightly elevated at 135/85. Recommended lifestyle changes including increased exercise and reduced sodium intake.",
    prescriptions: ["Lisinopril 10mg - once daily"]
  },
  {
    patientId: "P-001",
    date: "May 05, 2023",
    type: "Follow-up Visit",
    description: "Patient reports improvement in symptoms. Blood pressure normal at 120/80.",
    prescriptions: ["Continue current medications"]
  },
  {
    patientId: "P-002",
    date: "Nov 05, 2023",
    type: "Respiratory Infection",
    description: "Patient presenting with cough, congestion, and low-grade fever. Diagnosed with acute bronchitis. Recommended rest and increased fluid intake.",
    prescriptions: ["Azithromycin 250mg - once daily for 5 days", "Benzonatate 200mg - every 8 hours as needed for cough"]
  },
  {
    patientId: "P-003",
    date: "Aug 27, 2023",
    type: "Diabetes Check",
    description: "HbA1c at 7.2%, slight improvement from previous visit. Discussed dietary changes and importance of regular glucose monitoring.",
    prescriptions: ["Metformin 1000mg - twice daily", "Januvia 100mg - once daily"]
  },
  {
    patientId: "P-004",
    date: "Dec 03, 2023",
    type: "Sports Injury",
    description: "Grade 2 ankle sprain from basketball. Prescribed RICE protocol (Rest, Ice, Compression, Elevation). No fracture observed on X-ray.",
    prescriptions: ["Ibuprofen 600mg - every 6 hours as needed for pain"]
  },
  {
    patientId: "P-005",
    date: "Jan 15, 2024",
    type: "Allergy Consultation",
    description: "Seasonal allergies with increasing severity. Skin test positive for multiple environmental allergens. Discussed avoidance strategies.",
    prescriptions: ["Cetirizine 10mg - once daily", "Fluticasone nasal spray - 2 sprays each nostril daily"]
  }
];

// Mock Appointments
export const mockAppointments: PatientAppointment[] = [
  {
    patientId: "P-001",
    doctorId: "D-001",
    doctorName: "Dr. Theresa Webb",
    date: "Mar 15, 2024",
    time: "10:00 AM",
    type: "Blood Pressure Check",
    status: "confirmed"
  },
  {
    patientId: "P-001",
    doctorId: "D-003",
    doctorName: "Dr. Cameron Williamson",
    date: "Oct 12, 2023",
    time: "2:30 PM",
    type: "Annual Physical",
    status: "completed",
    notes: "Patient in good health. Blood pressure slightly elevated."
  },
  {
    patientId: "P-002",
    doctorId: "D-002",
    doctorName: "Dr. Jenny Wilson",
    date: "Apr 05, 2024",
    time: "9:15 AM",
    type: "Follow-up",
    status: "pending"
  },
  {
    patientId: "P-002",
    doctorId: "D-002",
    doctorName: "Dr. Jenny Wilson",
    date: "Nov 05, 2023",
    time: "3:45 PM",
    type: "Respiratory Infection",
    status: "completed",
    notes: "Diagnosed with acute bronchitis. Prescribed antibiotics."
  },
  {
    patientId: "P-003",
    doctorId: "D-004",
    doctorName: "Dr. Jacob Jones",
    date: "Aug 27, 2023",
    time: "11:30 AM",
    type: "Diabetes Check",
    status: "completed",
    notes: "HbA1c at 7.2%. Continuing current medication regimen."
  },
  {
    patientId: "P-003",
    doctorId: "D-004",
    doctorName: "Dr. Jacob Jones",
    date: "Feb 28, 2024",
    time: "1:00 PM",
    type: "Diabetes Follow-up",
    status: "cancelled"
  },
  {
    patientId: "P-004",
    doctorId: "D-005",
    doctorName: "Dr. Brooklyn Simmons",
    date: "Mar 22, 2024",
    time: "4:30 PM",
    type: "Physical Therapy",
    status: "confirmed"
  },
  {
    patientId: "P-004",
    doctorId: "D-005",
    doctorName: "Dr. Brooklyn Simmons",
    date: "Dec 03, 2023",
    time: "10:45 AM",
    type: "Sports Injury Assessment",
    status: "completed",
    notes: "Grade 2 ankle sprain. Prescribed RICE protocol."
  },
  {
    patientId: "P-005",
    doctorId: "D-006",
    doctorName: "Dr. Darrell Steward",
    date: "Jan 15, 2024",
    time: "2:00 PM",
    type: "Allergy Consultation",
    status: "completed",
    notes: "Positive skin test for multiple allergens. Prescribed antihistamines."
  },
  {
    patientId: "P-005",
    doctorId: "D-006",
    doctorName: "Dr. Darrell Steward",
    date: "Apr 18, 2024",
    time: "3:15 PM",
    type: "Allergy Follow-up",
    status: "confirmed"
  }
];
