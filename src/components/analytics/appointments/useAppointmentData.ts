
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { DateRange, getStartDate, subDays } from "../utils/dateUtils";

export const useAppointmentData = (dateRange: DateRange) => {
  const [loading, setLoading] = useState(true);
  const [statusData, setStatusData] = useState<any[]>([]);
  const [timeData, setTimeData] = useState<any[]>([]);
  const [appointmentTrends, setAppointmentTrends] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const startDate = getStartDate(dateRange);
      
      // Get appointments from Supabase
      const { data: appointments, error } = await supabase
        .from('appointments')
        .select('*')
        .gte('appointment_date', startDate.toISOString());
      
      if (error) throw error;
      
      if (appointments && appointments.length > 0) {
        // Process status data
        const statusCounts = {
          upcoming: 0,
          completed: 0,
          cancelled: 0
        };
        
        appointments.forEach((appointment) => {
          statusCounts[appointment.status as keyof typeof statusCounts]++;
        });
        
        const processedStatusData = [
          { name: 'Upcoming', value: statusCounts.upcoming, color: '#3b82f6' },
          { name: 'Completed', value: statusCounts.completed, color: '#10b981' },
          { name: 'Cancelled', value: statusCounts.cancelled, color: '#ef4444' }
        ];
        
        setStatusData(processedStatusData);
        
        // Process time data
        const timeCounts: Record<string, number> = {};
        
        appointments.forEach((appointment) => {
          const hour = appointment.start_time.split(':')[0];
          timeCounts[hour] = (timeCounts[hour] || 0) + 1;
        });
        
        const processedTimeData = Object.entries(timeCounts)
          .map(([hour, count]) => ({ 
            hour: hour.padStart(2, '0') + ':00', 
            appointments: count 
          }))
          .sort((a, b) => a.hour.localeCompare(b.hour));
        
        setTimeData(processedTimeData);
        
        // Process trend data
        const groupedByDate: Record<string, number> = {};
        
        appointments.forEach((appointment) => {
          const date = format(new Date(appointment.appointment_date), 'MM/dd');
          groupedByDate[date] = (groupedByDate[date] || 0) + 1;
        });
        
        // Get the last 7 days or relevant time period
        const currentDate = new Date();
        const trendDates = [];
        for (let i = 6; i >= 0; i--) {
          let date;
          if (dateRange === 'week' || dateRange === 'month') {
            date = format(subDays(currentDate, i), 'MM/dd');
          } else if (dateRange === 'quarter') {
            date = format(subDays(currentDate, i * 7), 'MM/dd');
          } else {
            date = format(subDays(currentDate, i * 30), 'MM/yyyy');
          }
          trendDates.push(date);
        }
        
        const processedTrendData = trendDates.map(date => ({
          date,
          appointments: groupedByDate[date] || 0
        }));
        
        setAppointmentTrends(processedTrendData);
      } else {
        // Set mock data if no appointments found
        setStatusData([
          { name: 'Upcoming', value: 15, color: '#3b82f6' },
          { name: 'Completed', value: 32, color: '#10b981' },
          { name: 'Cancelled', value: 5, color: '#ef4444' }
        ]);
        
        setTimeData([
          { hour: '09:00', appointments: 4 },
          { hour: '10:00', appointments: 7 },
          { hour: '11:00', appointments: 5 },
          { hour: '12:00', appointments: 3 },
          { hour: '13:00', appointments: 2 },
          { hour: '14:00', appointments: 6 },
          { hour: '15:00', appointments: 8 },
          { hour: '16:00', appointments: 5 }
        ]);
        
        const trendDates = [];
        const currentDate = new Date();
        for (let i = 6; i >= 0; i--) {
          trendDates.push({
            date: format(subDays(currentDate, i), 'MM/dd'),
            appointments: Math.floor(Math.random() * 8) + 5
          });
        }
        
        setAppointmentTrends(trendDates);
      }
    } catch (error) {
      console.error('Error fetching appointment statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    statusData,
    timeData,
    appointmentTrends
  };
};
