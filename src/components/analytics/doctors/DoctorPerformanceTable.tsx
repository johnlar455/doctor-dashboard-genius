
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Doctor } from "@/types/doctor";

interface FeedbackData {
  doctorId: string;
  doctorName: string;
  doctorAvatar: string | null;
  punctuality: number;
  knowledge: number;
  communication: number;
  friendliness: number;
  overall: number;
}

interface AppointmentCount {
  name: string;
  appointments: number;
  avgDuration: number;
  completed: number;
  cancelled: number;
}

interface DoctorPerformanceTableProps {
  feedbackData: FeedbackData[];
  appointmentCounts: AppointmentCount[];
  doctors: Doctor[];
  selectedDoctor: number;
  onDoctorSelect: (index: number) => void;
}

export const DoctorPerformanceTable: React.FC<DoctorPerformanceTableProps> = ({ 
  feedbackData, 
  appointmentCounts, 
  doctors, 
  selectedDoctor, 
  onDoctorSelect 
}) => {
  return (
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
                onClick={() => onDoctorSelect(index)}
              >
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={doctor.doctorAvatar || undefined} />
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
  );
};
