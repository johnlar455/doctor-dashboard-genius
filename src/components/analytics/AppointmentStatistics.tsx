
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { format, subMonths, subWeeks, subQuarters, subYears } from "date-fns";
import { Loader2 } from "lucide-react";

interface AppointmentStatisticsProps {
  dateRange: "week" | "month" | "quarter" | "year";
}

export const AppointmentStatistics: React.FC<AppointmentStatisticsProps> = ({ dateRange }) => {
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
      // Calculate date range
      const currentDate = new Date();
      let startDate;
      
      switch (dateRange) {
        case "week":
          startDate = subWeeks(currentDate, 1);
          break;
        case "month":
          startDate = subMonths(currentDate, 1);
          break;
        case "quarter":
          startDate = subQuarters(currentDate, 1);
          break;
        case "year":
          startDate = subYears(currentDate, 1);
          break;
      }
      
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
        const trendDates = [];
        for (let i = 6; i >= 0; i--) {
          let date;
          if (dateRange === 'week' || dateRange === 'month') {
            date = format(subDays(currentDate, i), 'MM/dd');
          } else if (dateRange === 'quarter') {
            date = format(subWeeks(currentDate, i), 'MM/dd');
          } else {
            date = format(subMonths(currentDate, i), 'MM/yyyy');
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
        
        setAppointmentTrends([
          { date: format(subDays(currentDate, 6), 'MM/dd'), appointments: 7 },
          { date: format(subDays(currentDate, 5), 'MM/dd'), appointments: 5 },
          { date: format(subDays(currentDate, 4), 'MM/dd'), appointments: 8 },
          { date: format(subDays(currentDate, 3), 'MM/dd'), appointments: 12 },
          { date: format(subDays(currentDate, 2), 'MM/dd'), appointments: 10 },
          { date: format(subDays(currentDate, 1), 'MM/dd'), appointments: 6 },
          { date: format(currentDate, 'MM/dd'), appointments: 9 }
        ]);
      }
    } catch (error) {
      console.error('Error fetching appointment statistics:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Helper function for subDays
  const subDays = (date: Date, days: number) => {
    const result = new Date(date);
    result.setDate(result.getDate() - days);
    return result;
  };

  const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading appointment statistics...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Appointment Status</CardTitle>
            <CardDescription>
              Distribution of appointments by status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderLabel}
                    outerRadius={110}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Appointment Times</CardTitle>
            <CardDescription>
              Distribution of appointments throughout the day
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={timeData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="appointments" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Appointment Trends</CardTitle>
          <CardDescription>
            Number of appointments over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={appointmentTrends}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="appointments"
                  stroke="hsl(var(--primary))"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
