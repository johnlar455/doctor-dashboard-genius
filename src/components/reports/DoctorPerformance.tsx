
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockDoctors } from "@/data/doctors";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

interface DoctorPerformanceProps {
  dateRange: "week" | "month" | "quarter" | "year";
}

export const DoctorPerformance: React.FC<DoctorPerformanceProps> = ({ dateRange }) => {
  // Mock data for appointment counts by doctor
  const appointmentCountData = [
    { name: "Dr. Smith", appointments: 45, avgDuration: 20 },
    { name: "Dr. Johnson", appointments: 38, avgDuration: 25 },
    { name: "Dr. Chen", appointments: 52, avgDuration: 15 },
    { name: "Dr. Wilson", appointments: 30, avgDuration: 30 },
    { name: "Dr. Garcia", appointments: 42, avgDuration: 22 },
  ];

  // Mock data for patient feedback scores
  const feedbackScoreData = [
    { doctor: "Dr. Smith", punctuality: 4.2, knowledge: 4.7, communication: 4.5, friendliness: 4.8, overall: 4.6 },
    { doctor: "Dr. Johnson", punctuality: 4.0, knowledge: 4.8, communication: 4.3, friendliness: 4.5, overall: 4.4 },
    { doctor: "Dr. Chen", punctuality: 4.7, knowledge: 4.9, communication: 4.6, friendliness: 4.4, overall: 4.7 },
    { doctor: "Dr. Wilson", punctuality: 3.9, knowledge: 4.6, communication: 4.2, friendliness: 4.7, overall: 4.3 },
    { doctor: "Dr. Garcia", punctuality: 4.5, knowledge: 4.7, communication: 4.8, friendliness: 4.9, overall: 4.8 },
  ];

  // Calculate doctor department distribution
  const departmentDistribution = mockDoctors.reduce((acc, doctor) => {
    const dept = doctor.department;
    acc[dept] = (acc[dept] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const departmentData = Object.entries(departmentDistribution).map(([department, count]) => ({
    name: department,
    value: count
  }));

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
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={feedbackScoreData[0]}>
                <PolarGrid />
                <PolarAngleAxis dataKey="name" />
                <PolarRadiusAxis angle={30} domain={[0, 5]} />
                <Radar name="Dr. Smith" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
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
              {mockDoctors.slice(0, 5).map((doctor, index) => (
                <TableRow key={doctor.id}>
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
                    {appointmentCountData[index]?.appointments || "40"}
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
        </CardContent>
      </Card>
    </div>
  );
};
