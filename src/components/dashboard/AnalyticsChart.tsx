
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AnalyticsChartProps {
  className?: string;
}

export const AnalyticsChart: React.FC<AnalyticsChartProps> = ({ className }) => {
  const data = [
    { name: "Mon", appointments: 4, patients: 3 },
    { name: "Tue", appointments: 6, patients: 5 },
    { name: "Wed", appointments: 8, patients: 7 },
    { name: "Thu", appointments: 5, patients: 4 },
    { name: "Fri", appointments: 9, patients: 8 },
    { name: "Sat", appointments: 3, patients: 2 },
    { name: "Sun", appointments: 2, patients: 1 },
  ];

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Appointment Analytics</CardTitle>
            <CardDescription>Appointments and patients this week</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Select defaultValue="weekly">
              <SelectTrigger className="h-8 w-[110px] text-xs">
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="h-8 text-xs">
              Download
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            barGap={8}
            margin={{ top: 20, right: 0, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false}
              tick={{ fontSize: 12, fill: '#888888' }}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#888888' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #f0f0f0',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
              }}
            />
            <Bar 
              dataKey="appointments" 
              fill="hsl(var(--primary))" 
              radius={[4, 4, 0, 0]} 
              name="Appointments"
            />
            <Bar 
              dataKey="patients" 
              fill="rgba(79, 144, 240, 0.5)" 
              radius={[4, 4, 0, 0]} 
              name="Patients"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
