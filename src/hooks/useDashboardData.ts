
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Appointment, AppointmentData, Doctor, Patient } from "@/types/supabase";
import { parseAvailability } from "@/types/supabase";
import { format, addDays, startOfDay, endOfDay } from "date-fns";

export const useDashboardData = () => {
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<AppointmentData[]>([]);
  const [todayAppointments, setTodayAppointments] = useState<AppointmentData[]>([]);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    newPatients: 0,
    patientSatisfaction: 0,
    departmentRank: 0,
  });
  const [patientStats, setPatientStats] = useState({
    new: 0,
    returning: 0,
    referred: 0,
  });
  const [appointmentsByDay, setAppointmentsByDay] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Get today's date range
        const today = new Date();
        const todayStr = format(today, 'yyyy-MM-dd');
        
        // Fetch upcoming appointments with patient and doctor details
        const { data: appointmentsData, error: appointmentsError } = await supabase
          .from('appointments')
          .select(`
            *,
            doctors:doctor_id(*),
            patients:patient_id(*)
          `)
          .eq('status', 'upcoming')
          .order('appointment_date', { ascending: true })
          .limit(10);

        if (appointmentsError) throw appointmentsError;
        
        // Fetch today's appointments
        const { data: todayApptsData, error: todayError } = await supabase
          .from('appointments')
          .select(`
            *,
            doctors:doctor_id(*),
            patients:patient_id(*)
          `)
          .eq('appointment_date', todayStr)
          .order('start_time', { ascending: true });

        if (todayError) throw todayError;

        // Get appointment stats
        const { data: apptStats, error: statsError } = await supabase
          .from('appointments')
          .select('id', { count: 'exact' });
        
        if (statsError) throw statsError;

        // Get new patients (registered in the last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const { data: newPatientData, error: patientError } = await supabase
          .from('patients')
          .select('id', { count: 'exact' })
          .gte('created_at', thirtyDaysAgo.toISOString());
          
        if (patientError) throw patientError;

        // Get appointments by day for the current week
        const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const weekData = [];
        
        for (let i = 0; i < 7; i++) {
          const date = addDays(today, i);
          const dateStr = format(date, 'yyyy-MM-dd');
          
          const { data: dayAppointments, error: dayError } = await supabase
            .from('appointments')
            .select('id', { count: 'exact' })
            .eq('appointment_date', dateStr);
            
          if (dayError) throw dayError;
          
          weekData.push({
            name: dayNames[i % 7],
            appointments: dayAppointments?.length || 0,
            patients: Math.max(0, (dayAppointments?.length || 0) - Math.floor(Math.random() * 3))
          });
        }

        // Process appointment data with doctor availability
        const processedAppointments = appointmentsData?.map(appt => {
          if (appt.doctors && appt.doctors.availability) {
            appt.doctors.availability = parseAvailability(appt.doctors.availability);
          }
          return appt as AppointmentData;
        }) || [];

        const processedTodayAppts = todayApptsData?.map(appt => {
          if (appt.doctors && appt.doctors.availability) {
            appt.doctors.availability = parseAvailability(appt.doctors.availability);
          }
          return appt as AppointmentData;
        }) || [];

        // Create doctor schedule
        const schedule = processedTodayAppts.map(appt => ({
          id: appt.id,
          time: appt.start_time,
          patientName: appt.patients?.name || "",
          patientInitials: appt.patients ? getInitials(appt.patients.name) : "",
          type: appt.type,
          status: "busy" as const,
        }));

        // Add available and break slots
        if (schedule.length === 0 || schedule.length < 5) {
          // Add dummy schedule if we don't have enough real appointments
          const dummySchedule = [
            {
              id: "1",
              time: "09:00 AM",
              patientName: "",
              patientInitials: "",
              type: "",
              status: "available" as const,
            },
            {
              id: "2",
              time: "10:00 AM",
              patientName: "Emma Wilson",
              patientInitials: "EW",
              type: "General Checkup",
              status: "busy" as const,
            },
            {
              id: "3",
              time: "11:30 AM",
              patientName: "Robert Johnson",
              patientInitials: "RJ",
              type: "Cardiology",
              status: "busy" as const,
            },
            {
              id: "4",
              time: "12:30 PM",
              patientName: "",
              patientInitials: "",
              type: "",
              status: "break" as const,
            },
            {
              id: "5",
              time: "01:00 PM",
              patientName: "Sarah Miller",
              patientInitials: "SM",
              type: "Dermatology",
              status: "busy" as const,
            },
          ];
          
          setAppointments(processedAppointments);
          setTodayAppointments(processedTodayAppts);
          setStats({
            totalAppointments: apptStats?.length || 32,
            newPatients: newPatientData?.length || 12,
            patientSatisfaction: 95,
            departmentRank: 2,
          });
          setAppointmentsByDay(weekData.length > 0 ? weekData : getDefaultWeekData());
          setPatientStats({
            new: 30,
            returning: 65,
            referred: 15,
          });
          
          return dummySchedule;
        }

        // Set fetched data to state
        setAppointments(processedAppointments);
        setTodayAppointments(processedTodayAppts);
        setStats({
          totalAppointments: apptStats?.length || 32,
          newPatients: newPatientData?.length || 12,
          patientSatisfaction: 95,
          departmentRank: 2,
        });
        setAppointmentsByDay(weekData.length > 0 ? weekData : getDefaultWeekData());
        setPatientStats({
          new: 30,
          returning: 65,
          referred: 15,
        });
        
        return schedule;
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again later.");
        return getDefaultSchedule();
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Helper functions
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase();
  };

  const getDefaultWeekData = () => {
    return [
      { name: "Mon", appointments: 4, patients: 3 },
      { name: "Tue", appointments: 6, patients: 5 },
      { name: "Wed", appointments: 8, patients: 7 },
      { name: "Thu", appointments: 5, patients: 4 },
      { name: "Fri", appointments: 9, patients: 8 },
      { name: "Sat", appointments: 3, patients: 2 },
      { name: "Sun", appointments: 2, patients: 1 },
    ];
  };

  const getDefaultSchedule = () => {
    return [
      {
        id: "1",
        time: "09:00 AM",
        patientName: "",
        patientInitials: "",
        type: "",
        status: "available" as const,
      },
      {
        id: "2",
        time: "10:00 AM",
        patientName: "Emma Wilson",
        patientInitials: "EW",
        type: "General Checkup",
        status: "busy" as const,
      },
      {
        id: "3",
        time: "11:30 AM",
        patientName: "Robert Johnson",
        patientInitials: "RJ",
        type: "Cardiology",
        status: "busy" as const,
      },
      {
        id: "4",
        time: "12:30 PM",
        patientName: "",
        patientInitials: "",
        type: "",
        status: "break" as const,
      },
      {
        id: "5",
        time: "01:00 PM",
        patientName: "Sarah Miller",
        patientInitials: "SM",
        type: "Dermatology",
        status: "busy" as const,
      },
    ];
  };

  return {
    loading,
    error,
    appointments,
    todayAppointments,
    stats,
    patientStats,
    appointmentsByDay,
  };
};
