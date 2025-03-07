
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { Doctor, DoctorSchedule } from "@/types/supabase";
import { format, subMonths, subWeeks, subQuarters, subYears, parseISO } from "date-fns";

interface DoctorPerformanceProps {
  dateRange: "week" | "month" | "quarter" | "year";
}

// This would typically come from a feedback table in the database
// For now, we'll generate mock feedback based on doctors
interface DoctorFeedback {
  doctor: string;
  doctorId: string;
  punctuality: number;
  knowledge: number;
  communication: number;
  friendliness: number;
  overall: number;
}

export const DoctorPerformance: React.FC<DoctorPerformanceProps> = ({ dateRange }) => {
  const [selectedDoctor, setSelectedDoctor] = useState(0);
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointmentCountData, setAppointmentCountData] = useState<{ name: string; appointments: number; avgDuration: number }[]>([]);
  const [feedbackScoreData, setFeedbackScoreData] = useState<DoctorFeedback[]>([]);
  
  useEffect(() => {
    fetchDoctorData();
  }, [dateRange]);

  const fetchDoctorData = async () => {
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
      
      // Fetch doctors from Supabase
      const { data: doctorsData, error: doctorsError } = await supabase
        .from("doctors")
        .select("*");
      
      if (doctorsError) throw doctorsError;
      
      if (doctorsData && doctorsData.length > 0) {
        setDoctors(doctorsData as Doctor[]);
        
        // Fetch appointment counts for each doctor
        const appointmentPromises = doctorsData.map(async (doctor: Doctor) => {
          const { data: appointments, error: appointmentsError } = await supabase
            .from("doctor_schedules")
            .select("*")
            .eq("doctor_id", doctor.id)
            .gte("slot_date", startDate.toISOString());
          
          if (appointmentsError) throw appointmentsError;
          
          // Calculate average appointment duration (mock data for now)
          // In a real app, you'd calculate this from the start_time and end_time
          const avgDuration = Math.floor(Math.random() * 15) + 15; // 15-30 minutes
          
          return {
            name: doctor.name,
            appointments: appointments?.length || 0,
            avgDuration
          };
        });
        
        const appointmentCounts = await Promise.all(appointmentPromises);
        setAppointmentCountData(appointmentCounts);
        
        // Generate mock feedback data
        // In a real app, this would come from a feedback table
        const mockFeedback = doctorsData.map((doctor: Doctor) => {
          // Generate random scores between 3.8 and 5.0
          const generateScore = () => (Math.random() * 1.2 + 3.8).toFixed(1);
          
          const punctuality = parseFloat(generateScore());
          const knowledge = parseFloat(generateScore());
          const communication = parseFloat(generateScore());
          const friendliness = parseFloat(generateScore());
          
          // Overall is the average of all other scores
          const overall = parseFloat(
            ((punctuality + knowledge + communication + friendliness) / 4).toFixed(1)
          );
          
          return {
            doctor: doctor.name,
            doctorId: doctor.id,
            punctuality,
            knowledge,
            communication,
            friendliness,
            overall
          };
        });
        
        setFeedbackScoreData(mockFeedback);
      }
    } catch (error) {
      console.error("Error fetching doctor data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Transform the feedback data for the selected doctor into the format required by RadarChart
  const transformFeedbackToRadarData = (doctorIndex: number) => {
    const doctor = feedbackScoreData[doctorIndex];
    if (!doctor) return [];
    
    return [
      { name: "Punctuality", value: doctor.punctuality },
      { name: "Knowledge", value: doctor.knowledge },
      { name: "Communication", value: doctor.communication },
      { name: "Friendliness", value: doctor.friendliness },
      { name: "Overall", value: doctor.overall }
    ];
  };

  const radarData = transformFeedbackToRadarData(selectedDoctor);

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
            {appointmentCountData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={appointmentCountData}
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
                  <Bar dataKey="appointments" fill="#8884d8" name="Appointments" />
                  <Bar dataKey="avgDuration" fill="#82ca9d" name="Avg. Duration (min)" />
                </BarChart>
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
            <CardTitle>Patient Feedback Analysis</CardTitle>
            <CardDescription>
              Doctor performance based on patient feedback
            </CardDescription>
          </CardHeader>
          <CardContent>
            {radarData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="name" />
                  <PolarRadiusAxis angle={30} domain={[0, 5]} />
                  <Radar 
                    name={feedbackScoreData[selectedDoctor]?.doctor || "Doctor"} 
                    dataKey="value" 
                    stroke="#8884d8" 
                    fill="#8884d8" 
                    fillOpacity={0.6} 
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px]">
                <p className="text-muted-foreground">No feedback data available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Doctor Performance Metrics</CardTitle>
          <CardDescription>
            Overall ratings based on multiple factors
          </CardDescription>
        </CardHeader>
        <CardContent>
          {doctors.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Overall Rating</TableHead>
                  <TableHead>Appointments</TableHead>
                  <TableHead>Performance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {doctors.slice(0, 5).map((doctor, index) => (
                  <TableRow 
                    key={doctor.id} 
                    className="cursor-pointer hover:bg-muted/80"
                    onClick={() => setSelectedDoctor(index)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={doctor.avatar} alt={doctor.name} />
                          <AvatarFallback>{doctor.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{doctor.name}</div>
                          <div className="text-sm text-muted-foreground">{doctor.specialty}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {feedbackScoreData[index]?.overall || "4.5"}/5.0
                    </TableCell>
                    <TableCell>
                      {appointmentCountData[index]?.appointments || "0"}
                    </TableCell>
                    <TableCell>
                      <div className="w-full">
                        <Progress value={
                          ((feedbackScoreData[index]?.overall || 4.5) / 5) * 100
                        } className="h-2" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex items-center justify-center h-[200px]">
              <p className="text-muted-foreground">No doctor data available</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
