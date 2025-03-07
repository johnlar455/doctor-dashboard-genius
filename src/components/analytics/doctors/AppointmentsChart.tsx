
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface AppointmentsChartProps {
  appointmentCounts: Array<{
    name: string;
    appointments: number;
    completed: number;
    cancelled: number;
  }>;
}

export const AppointmentsChart: React.FC<AppointmentsChartProps> = ({ appointmentCounts }) => {
  return (
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
  );
};
