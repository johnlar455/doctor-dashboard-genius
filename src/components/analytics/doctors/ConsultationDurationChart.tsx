
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface ConsultationDurationChartProps {
  appointmentCounts: Array<{
    name: string;
    avgDuration: number;
  }>;
}

export const ConsultationDurationChart: React.FC<ConsultationDurationChartProps> = ({ appointmentCounts }) => {
  return (
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
  );
};
