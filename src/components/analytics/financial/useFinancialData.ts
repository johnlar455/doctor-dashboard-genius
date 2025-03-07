
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DateRange, getStartDate } from "../utils/dateUtils";
import { format, parseISO } from "date-fns";

export const useFinancialData = (dateRange: DateRange) => {
  const [loading, setLoading] = useState(true);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [serviceRevenueData, setServiceRevenueData] = useState<any[]>([]);
  const [monthlyRevenueData, setMonthlyRevenueData] = useState<any[]>([]);
  const [topServicesData, setTopServicesData] = useState<any[]>([]);
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Calculate date range
      const startDate = getStartDate(dateRange);
      
      // Get appointments from Supabase
      // In a real application, this would likely involve a financials or payments table
      const { data: appointments, error } = await supabase
        .from('appointments')
        .select('*')
        .gte('appointment_date', startDate.toISOString());
      
      if (error) throw error;
      
      // Since we don't have actual financial data, we'll generate mock data based on appointments
      
      // Generate revenue data by status
      const generateRevenue = () => {
        // These would be actual fees in a real application
        const consultationFee = 150;
        const followUpFee = 100;
        const specializedFee = 250;
        
        let completedRevenue = 0;
        let cancelledRevenue = 0;
        let upcomingRevenue = 0;
        
        if (appointments) {
          appointments.forEach(appointment => {
            let fee;
            
            // Determine fee based on appointment type
            if (appointment.type?.toLowerCase().includes('follow')) {
              fee = followUpFee;
            } else if (appointment.type?.toLowerCase().includes('special')) {
              fee = specializedFee;
            } else {
              fee = consultationFee;
            }
            
            // Distribute based on appointment status
            if (appointment.status === 'completed') {
              completedRevenue += fee;
            } else if (appointment.status === 'cancelled') {
              // Assuming 20% cancellation fee
              cancelledRevenue += fee * 0.2;
            } else if (appointment.status === 'upcoming') {
              upcomingRevenue += fee;
            }
          });
        }
        
        return [
          { name: 'Completed', value: completedRevenue, color: '#10b981' },
          { name: 'Cancelled', value: cancelledRevenue, color: '#ef4444' },
          { name: 'Scheduled', value: upcomingRevenue, color: '#3b82f6' }
        ];
      };
      
      // Generate service revenue data
      const generateServiceRevenue = () => {
        const services = {
          'General Checkup': 0,
          'Consultation': 0,
          'Follow-up': 0,
          'Specialized': 0,
          'Other': 0
        };
        
        const fees = {
          'General Checkup': 150,
          'Consultation': 175,
          'Follow-up': 100,
          'Specialized': 250,
          'Other': 125
        };
        
        if (appointments) {
          appointments.forEach(appointment => {
            if (appointment.status === 'completed') {
              // Categorize by appointment type
              if (appointment.type?.includes('Check')) {
                services['General Checkup']++;
              } else if (appointment.type?.includes('Consult')) {
                services['Consultation']++;
              } else if (appointment.type?.includes('Follow')) {
                services['Follow-up']++;
              } else if (appointment.type?.includes('Special')) {
                services['Specialized']++;
              } else {
                services['Other']++;
              }
            }
          });
        }
        
        return Object.entries(services).map(([name, count]) => ({
          name,
          revenue: count * fees[name as keyof typeof fees]
        }));
      };
      
      // Generate monthly revenue data
      const generateMonthlyRevenue = () => {
        const months = [];
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        
        for (let i = 11; i >= 0; i--) {
          const monthDate = new Date(currentDate);
          monthDate.setMonth(currentMonth - i);
          
          months.push({
            name: format(monthDate, 'MMM'),
            revenue: 0,
            expenses: 0,
            profit: 0
          });
        }
        
        if (appointments) {
          appointments.forEach(appointment => {
            if (appointment.status === 'completed') {
              const appointmentDate = parseISO(appointment.appointment_date);
              const monthName = format(appointmentDate, 'MMM');
              const monthIndex = months.findIndex(m => m.name === monthName);
              
              if (monthIndex !== -1) {
                // Add random revenue between $100-$300
                const revenue = Math.floor(Math.random() * 200) + 100;
                months[monthIndex].revenue += revenue;
                
                // Calculate expenses (60-80% of revenue)
                const expenseRate = 0.6 + Math.random() * 0.2;
                const expenses = Math.floor(revenue * expenseRate);
                months[monthIndex].expenses += expenses;
                
                // Calculate profit
                months[monthIndex].profit += (revenue - expenses);
              }
            }
          });
        }
        
        // If we have no real data, generate meaningful mock data
        if (!appointments || appointments.length === 0) {
          months.forEach(month => {
            month.revenue = Math.floor(Math.random() * 15000) + 20000;
            month.expenses = Math.floor(month.revenue * (0.6 + Math.random() * 0.2));
            month.profit = month.revenue - month.expenses;
          });
        }
        
        return months;
      };
      
      // Generate top revenue services
      const generateTopServices = () => {
        const serviceTypes = [
          'Regular Consultation',
          'Specialized Consultation',
          'Follow-up Visit',
          'Emergency Consultation',
          'Diagnostic Tests',
          'Preventive Checkup',
          'Virtual Consultation'
        ];
        
        return serviceTypes.map(service => {
          const appointments = Math.floor(Math.random() * 100) + 50;
          const revenue = appointments * (Math.floor(Math.random() * 150) + 100);
          const growth = Math.floor(Math.random() * 40) - 10; // -10% to +30%
          
          return {
            service,
            appointments,
            revenue,
            growth
          };
        }).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
      };
      
      // Set data states
      setRevenueData(generateRevenue());
      setServiceRevenueData(generateServiceRevenue());
      setMonthlyRevenueData(generateMonthlyRevenue());
      setTopServicesData(generateTopServices());
    } catch (error) {
      console.error('Error fetching financial data:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    revenueData,
    serviceRevenueData,
    monthlyRevenueData,
    topServicesData,
    formatCurrency
  };
};
