
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { DoctorSchedule } from "@/types/supabase";
import { format, subMonths, subWeeks, subQuarters, subYears, parseISO, startOfWeek, endOfWeek, isWithinInterval, addDays } from "date-fns";

interface AppointmentReportProps {
  dateRange: "week" | "month" | "quarter" | "year";
}

export const AppointmentReport: React.FC<AppointmentReportProps> = ({ dateRange }) => {
  const [loading, setLoading] = useState(true);
  const [statusData, setStatusData] = useState<{ name: string; value: number; color: string }[]>([]);
  const [trendData, setTrendData] = useState<{ name: string; completed: number; cancelled: number; total: number }[]>([]);
  const [recentAppointments, setRecentAppointments] = useState<any[]>([]);

  useEffect(() => {
    fetchAppointmentData();
  }, [dateRange]);

  const fetchAppointmentData = async () => {
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
        default:
          startDate = subMonths(currentDate, 1);
      }
      
      // Fetch appointment data from Supabase
      const { data: appointments, error } = await supabase
        .from("doctor_schedules")
        .select(`
          *,
          doctors(name),
          patients(name)
        `)
        .gte("slot_date", startDate.toISOString())
        .order("slot_date", { ascending: false });
      
      if (error) throw error;
      
      if (appointments && appointments.length > 0) {
        // Process data for status distribution
        const statusCounts: Record<string, number> = {};
        appointments.forEach((appointment: any) => {
          const status = appointment.status || "pending";
          statusCounts[status] = (statusCounts[status] || 0) + 1;
        });
        
        const statusColors: Record<string, string> = {
          completed: "#4ade80",
          booked: "#60a5fa",
          available: "#facc15",
          unavailable: "#f87171",
        };
        
        const processedStatusData = Object.entries(statusCounts).map(([status, count]) => ({
          name: status.charAt(0).toUpperCase() + status.slice(1),
          value: count,
          color: statusColors[status] || "#9ca3af"
        }));
        
        setStatusData(processedStatusData);
        
        // Process data for weekly trends
        // Get the start and end of the current week
        const weekStart = startOfWeek(currentDate);
        const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
        
        const weeklyData = weekDays.map((day) => {
          const dayName = format(day, "EEE");
          const dayAppointments = appointments.filter((appointment: any) => {
            const appointmentDate = parseISO(appointment.slot_date);
            return format(appointmentDate, "yyyy-MM-dd") === format(day, "yyyy-MM-dd");
          });
          
          const completed = dayAppointments.filter((a: any) => a.status === "completed").length;
          const cancelled = dayAppointments.filter((a: any) => a.status === "unavailable").length;
          
          return {
            name: dayName,
            completed,
            cancelled,
            total: dayAppointments.length
          };
        });
        
        setTrendData(weeklyData);
        
        // Process data for recent appointments table
        const recentAppointmentsData = appointments.slice(0, 5).map((appointment: any) => ({
          date: format(parseISO(appointment.slot_date), "yyyy-MM-dd"),
          time: `${appointment.start_time} - ${appointment.end_time}`,
          patientId: appointment.patient_id || "N/A",
          patientName: appointment.patients?.name || "N/A",
          doctorName: appointment.doctors?.name || "N/A",
          type: appointment.status === "booked" ? "Scheduled" : appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1),
          status: appointment.status
        }));
        
        setRecentAppointments(recentAppointmentsData);
      }
    } catch (error) {
      console.error("Error fetching appointment data:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
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
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Appointment Status Distribution</CardTitle>
            <CardDescription>
              Overview of appointment status for {dateRange === "week" ? "the past week" : 
                dateRange === "month" ? "the past month" : 
                dateRange === "quarter" ? "the last quarter" : "the past year"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={100}
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
            ) : (
              <div className="flex items-center justify-center h-[300px]">
                <p className="text-muted-foreground">No appointment data available</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Appointment Trends</CardTitle>
            <CardDescription>
              Weekly trends of completed vs cancelled appointments
            </CardDescription>
          </CardHeader>
          <CardContent>
            {trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={trendData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 0,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="completed" fill="#4ade80" name="Completed" />
                  <Bar dataKey="cancelled" fill="#f87171" name="Cancelled" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px]">
                <p className="text-muted-foreground">No trend data available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Appointment Data</CardTitle>
          <CardDescription>
            Detailed view of the most recent appointments
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentAppointments.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentAppointments.map((appointment, index) => (
                  <TableRow key={index}>
                    <TableCell>{appointment.date}</TableCell>
                    <TableCell>{appointment.time}</TableCell>
                    <TableCell>{appointment.patientName}</TableCell>
                    <TableCell>{appointment.doctorName}</TableCell>
                    <TableCell>{appointment.type}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${appointment.status === 'completed' ? 'bg-green-100 text-green-800' : 
                          appointment.status === 'unavailable' ? 'bg-red-100 text-red-800' :
                          appointment.status === 'booked' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex items-center justify-center h-[200px]">
              <p className="text-muted-foreground">No recent appointments found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
