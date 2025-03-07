
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, Bar, LineChart, Line, RadarChart, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, Radar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { format, subMonths, subWeeks, subQuarters, subYears } from "date-fns";
import { Loader2 } from "lucide-react";
import { Doctor } from "@/types/supabase";

interface DoctorPerformanceAnalyticsProps {
  dateRange: "week" | "month" | "quarter" | "year";
}

export const DoctorPerformanceAnalytics: React.FC<DoctorPerformanceAnalyticsProps> = ({ dateRange }) => {
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
      
      // Get doctors from Supabase
      const { data: doctorsData, error: doctorsError } = await supabase
        .from('doctors')
        .select('*');
      
      if (doctorsError) throw doctorsError;
      
      if (doctorsData && doctorsData.length > 0) {
        setDoctors(doctorsData);
        
        // Get appointments for each doctor
        const appointmentPromises = doctorsData.map(async (doctor: Doctor) => {
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
        const mockFeedbackData = doctorsData.map((doctor: Doctor) => {
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
          { id: '1', name: 'Dr. John Smith', specialty: 'Cardiologist', avatar: null },
          { id: '2', name: 'Dr. Sarah Johnson', specialty: 'Pediatrician', avatar: null },
          { id: '3', name: 'Dr. Robert Williams', specialty: 'Neurologist', avatar: null },
          { id: '4', name: 'Dr. Emily Davis', specialty: 'Dermatologist', avatar: null },
          { id: '5', name: 'Dr. Michael Brown', specialty: 'Orthopedic Surgeon', avatar: null }
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading doctor performance data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Appointments by Doctor</CardTitle>
            <CardDescription>
              Number of appointments handled by each doctor
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={appointmentCounts}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 65,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end" 
                    height={70}
                    interval={0}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="appointments" fill="hsl(var(--primary))" name="Total" />
                  <Bar dataKey="completed" fill="#10b981" name="Completed" />
                  <Bar dataKey="cancelled" fill="#ef4444" name="Cancelled" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Consultation Duration</CardTitle>
            <CardDescription>
              Average consultation time by doctor (minutes)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={appointmentCounts}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 65,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end" 
                    height={70}
                    interval={0}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="avgDuration" fill="#64748b" name="Minutes" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Patient Feedback Analysis</CardTitle>
            <CardDescription>
              Patient ratings for {feedbackData[selectedDoctor]?.doctorName || 'selected doctor'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={feedbackRadarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="name" />
                  <PolarRadiusAxis angle={30} domain={[0, 5]} />
                  <Radar
                    name="Rating"
                    dataKey="value"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.6}
                  />
                  <Tooltip />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Doctor Performance Metrics</CardTitle>
            <CardDescription>
              Overall ratings based on patient feedback
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Appointments</TableHead>
                  <TableHead>Performance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {feedbackData.map((doctor, index) => (
                  <TableRow 
                    key={doctor.doctorId} 
                    className={`cursor-pointer ${index === selectedDoctor ? 'bg-muted' : ''}`}
                    onClick={() => handleDoctorSelect(index)}
                  >
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={doctor.doctorAvatar} />
                          <AvatarFallback>
                            {doctor.doctorName.split(' ').map((n: string) => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{doctor.doctorName}</div>
                          <div className="text-sm text-muted-foreground">
                            {doctors[index]?.specialty || 'Specialist'}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{doctor.overall}/5.0</TableCell>
                    <TableCell>
                      {appointmentCounts[index]?.appointments || 0}
                    </TableCell>
                    <TableCell className="w-[150px]">
                      <Progress 
                        value={doctor.overall * 20} 
                        className="h-2" 
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
