
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DateRange, getStartDate } from "../utils/dateUtils";
import { Doctor, parseDoctorAvailability } from "@/types/doctor";

export const useDoctorPerformanceData = (dateRange: DateRange) => {
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState(0);
  const [appointmentCounts, setAppointmentCounts] = useState<any[]>([]);
  const [feedbackData, setFeedbackData] = useState<any[]>([]);
  const [feedbackRadarData, setFeedbackRadarData] = useState<any[]>([]);
  
  useEffect(() => {
    fetchData();
  }, [dateRange]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Calculate date range
      const startDate = getStartDate(dateRange);
      
      // Get doctors from Supabase
      const { data: doctorsData, error: doctorsError } = await supabase
        .from('doctors')
        .select('*');
      
      if (doctorsError) throw doctorsError;
      
      if (doctorsData && doctorsData.length > 0) {
        // Convert from Supabase format to our Doctor type
        const typedDoctors: Doctor[] = doctorsData.map(doctor => ({
          ...doctor,
          availability: parseDoctorAvailability(doctor.availability)
        }));
        
        setDoctors(typedDoctors);
        
        // Get appointments for each doctor
        const appointmentPromises = typedDoctors.map(async (doctor: Doctor) => {
          const { data: appointments, error } = await supabase
            .from('appointments')
            .select('*')
            .eq('doctor_id', doctor.id)
            .gte('appointment_date', startDate.toISOString());
          
          // Calculate average consultation time (mocked for now)
          const avgDuration = Math.floor(Math.random() * 15) + 20; // 20-35 minutes
          
          return {
            name: doctor.name,
            appointments: appointments?.length || 0,
            avgDuration,
            completed: appointments?.filter(a => a.status === 'completed').length || 0,
            cancelled: appointments?.filter(a => a.status === 'cancelled').length || 0
          };
        });
        
        const appointmentData = await Promise.all(appointmentPromises);
        setAppointmentCounts(appointmentData);
        
        // Generate mock feedback data
        // In a real application, this would come from a feedback table
        const mockFeedbackData = typedDoctors.map((doctor: Doctor) => {
          const generateScore = () => (Math.random() * 1.5 + 3.5).toFixed(1); // Generate between 3.5 and 5
          
          return {
            doctorId: doctor.id,
            doctorName: doctor.name,
            doctorAvatar: doctor.avatar,
            punctuality: parseFloat(generateScore()),
            knowledge: parseFloat(generateScore()),
            communication: parseFloat(generateScore()),
            friendliness: parseFloat(generateScore()),
            overall: parseFloat(
              ((Math.random() * 1.5 + 3.5)).toFixed(1)
            )
          };
        });
        
        setFeedbackData(mockFeedbackData);
        
        // Set initial radar data for first doctor
        if (mockFeedbackData.length > 0) {
          setFeedbackRadarData([
            { name: 'Punctuality', value: mockFeedbackData[0].punctuality },
            { name: 'Knowledge', value: mockFeedbackData[0].knowledge },
            { name: 'Communication', value: mockFeedbackData[0].communication },
            { name: 'Friendliness', value: mockFeedbackData[0].friendliness },
            { name: 'Overall', value: mockFeedbackData[0].overall }
          ]);
        }
      } else {
        // Set mock data if no doctors found
        const mockDoctors = [
          { id: '1', name: 'Dr. John Smith', specialty: 'Cardiologist', department: 'Cardiology', email: 'john.smith@example.com', phone: '123-456-7890', bio: 'Experienced cardiologist', avatar: null, availability: { start: '09:00', end: '17:00', days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] } },
          { id: '2', name: 'Dr. Sarah Johnson', specialty: 'Pediatrician', department: 'Pediatrics', email: 'sarah.johnson@example.com', phone: '123-456-7891', bio: 'Caring pediatrician', avatar: null, availability: { start: '09:00', end: '17:00', days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] } },
          { id: '3', name: 'Dr. Robert Williams', specialty: 'Neurologist', department: 'Neurology', email: 'robert.williams@example.com', phone: '123-456-7892', bio: 'Expert neurologist', avatar: null, availability: { start: '09:00', end: '17:00', days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] } },
          { id: '4', name: 'Dr. Emily Davis', specialty: 'Dermatologist', department: 'Dermatology', email: 'emily.davis@example.com', phone: '123-456-7893', bio: 'Skilled dermatologist', avatar: null, availability: { start: '09:00', end: '17:00', days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] } },
          { id: '5', name: 'Dr. Michael Brown', specialty: 'Orthopedic Surgeon', department: 'Orthopedics', email: 'michael.brown@example.com', phone: '123-456-7894', bio: 'Experienced orthopedic surgeon', avatar: null, availability: { start: '09:00', end: '17:00', days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] } }
        ] as Doctor[];
        
        setDoctors(mockDoctors);
        
        setAppointmentCounts([
          { name: 'Dr. John Smith', appointments: 42, avgDuration: 25, completed: 35, cancelled: 7 },
          { name: 'Dr. Sarah Johnson', appointments: 38, avgDuration: 30, completed: 33, cancelled: 5 },
          { name: 'Dr. Robert Williams', appointments: 35, avgDuration: 28, completed: 30, cancelled: 5 },
          { name: 'Dr. Emily Davis', appointments: 32, avgDuration: 22, completed: 29, cancelled: 3 },
          { name: 'Dr. Michael Brown', appointments: 30, avgDuration: 32, completed: 27, cancelled: 3 }
        ]);
        
        const mockFeedbackData = mockDoctors.map(doctor => {
          const generateScore = () => (Math.random() * 1.5 + 3.5).toFixed(1);
          
          return {
            doctorId: doctor.id,
            doctorName: doctor.name,
            doctorAvatar: doctor.avatar,
            punctuality: parseFloat(generateScore()),
            knowledge: parseFloat(generateScore()),
            communication: parseFloat(generateScore()),
            friendliness: parseFloat(generateScore()),
            overall: parseFloat(
              ((Math.random() * 1.5 + 3.5)).toFixed(1)
            )
          };
        });
        
        setFeedbackData(mockFeedbackData);
        
        setFeedbackRadarData([
          { name: 'Punctuality', value: 4.2 },
          { name: 'Knowledge', value: 4.7 },
          { name: 'Communication', value: 4.5 },
          { name: 'Friendliness', value: 4.8 },
          { name: 'Overall', value: 4.6 }
        ]);
      }
    } catch (error) {
      console.error('Error fetching doctor performance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDoctorSelect = (index: number) => {
    setSelectedDoctor(index);
    
    if (feedbackData[index]) {
      const doctor = feedbackData[index];
      setFeedbackRadarData([
        { name: 'Punctuality', value: doctor.punctuality },
        { name: 'Knowledge', value: doctor.knowledge },
        { name: 'Communication', value: doctor.communication },
        { name: 'Friendliness', value: doctor.friendliness },
        { name: 'Overall', value: doctor.overall }
      ]);
    }
  };

  return {
    loading,
    doctors,
    selectedDoctor,
    appointmentCounts,
    feedbackData,
    feedbackRadarData,
    handleDoctorSelect
  };
};
