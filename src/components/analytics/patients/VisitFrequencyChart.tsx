
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface VisitFrequencyChartProps {
  frequencyData: Array<{
    name: string;
    value: number;
  }>;
}

export const VisitFrequencyChart: React.FC<VisitFrequencyChartProps> = ({ frequencyData }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Visit Frequency</CardTitle>
        <CardDescription>
          Number of visits per patient
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={frequencyData}
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
              <Bar dataKey="value" fill="hsl(var(--primary))" name="Patients" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
