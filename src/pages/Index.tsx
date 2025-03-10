
import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { CalendarDays, CheckCircle2, Clock, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Index = () => {
  const [stats, setStats] = useState({
    totalAppointments: 0,
    totalPatients: 0,
    upcomingAppointments: 0,
    completedToday: 0
  });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      setLoading(true);
      try {
        // Fetch total appointments
        const { count: totalAppointments, error: appointmentsError } = await supabase
          .from('appointments')
          .select('*', { count: 'exact', head: true });

        if (appointmentsError) throw appointmentsError;

        // Fetch total patients
        const { count: totalPatients, error: patientsError } = await supabase
          .from('patients')
          .select('*', { count: 'exact', head: true });

        if (patientsError) throw patientsError;

        // Fetch upcoming appointments (today and future)
        const today = new Date().toISOString().split('T')[0];
        const { count: upcomingAppointments, error: upcomingError } = await supabase
          .from('appointments')
          .select('*', { count: 'exact', head: true })
          .gte('appointment_date', today)
          .eq('status', 'upcoming');

        if (upcomingError) throw upcomingError;

        // Fetch completed appointments today
        const { count: completedToday, error: completedError } = await supabase
          .from('appointments')
          .select('*', { count: 'exact', head: true })
          .eq('appointment_date', today)
          .eq('status', 'completed');

        if (completedError) throw completedError;

        // Fetch monthly data for chart
        // Using mock data for now since aggregating by month requires more complex queries
        // This could be enhanced with a real monthly aggregation query
        
        setStats({
          totalAppointments: totalAppointments || 0,
          totalPatients: totalPatients || 0,
          upcomingAppointments: upcomingAppointments || 0,
          completedToday: completedToday || 0
        });

        // For the chart data, we'll use the mock data for now
        // In a real application, you should fetch this from the database
        setChartData(getMockChartData());
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Could not load dashboard data');
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  // This function provides mock data for the chart
  // In a real application, this should come from actual database queries
  const getMockChartData = () => {
    return [
      { name: "Jan", Appointments: 40, Patients: 24 },
      { name: "Feb", Appointments: 30, Patients: 13 },
      { name: "Mar", Appointments: 20, Patients: 98 },
      { name: "Apr", Appointments: 27, Patients: 39 },
      { name: "May", Appointments: 18, Patients: 48 },
      { name: "Jun", Appointments: 23, Patients: 38 },
      { name: "Jul", Appointments: 34, Patients: 43 },
      { name: "Aug", Appointments: 34, Patients: 43 },
      { name: "Sep", Appointments: 34, Patients: 43 },
      { name: "Oct", Appointments: 34, Patients: 43 },
      { name: "Nov", Appointments: 34, Patients: 43 },
      { name: "Dec", Appointments: 34, Patients: 43 }
    ];
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Track key metrics and get a quick overview of your healthcare
            practice
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Total Appointments</CardTitle>
              <CardDescription>All time appointments</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center space-x-4 p-4">
              <CalendarDays className="h-10 w-10 text-blue-500" />
              <div className="space-y-1">
                <div className="text-2xl font-bold">{loading ? "..." : stats.totalAppointments}</div>
                <Badge variant="secondary">
                  <Clock className="h-4 w-4 mr-2" />
                  Updated just now
                </Badge>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Patients</CardTitle>
              <CardDescription>All time patients</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center space-x-4 p-4">
              <Users className="h-10 w-10 text-green-500" />
              <div className="space-y-1">
                <div className="text-2xl font-bold">{loading ? "..." : stats.totalPatients}</div>
                <Badge variant="secondary">
                  <Clock className="h-4 w-4 mr-2" />
                  Updated just now
                </Badge>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
              <CardDescription>Appointments for today</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center space-x-4 p-4">
              <Clock className="h-10 w-10 text-orange-500" />
              <div className="space-y-1">
                <div className="text-2xl font-bold">{loading ? "..." : stats.upcomingAppointments}</div>
                <Badge variant="secondary">
                  Status: {stats.upcomingAppointments > 20 ? "busy" : "normal"}
                </Badge>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Completed Appointments</CardTitle>
              <CardDescription>Appointments completed today</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center space-x-4 p-4">
              <CheckCircle2 className="h-10 w-10 text-purple-500" />
              <div className="space-y-1">
                <div className="text-2xl font-bold">{loading ? "..." : stats.completedToday}</div>
                <Badge variant="secondary">
                  <Clock className="h-4 w-4 mr-2" />
                  Updated just now
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardDescription>
              Monthly appointments and patients
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Appointments" fill="#8884d8" />
                <Bar dataKey="Patients" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Index;
