
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { useDashboardData } from "@/hooks/useDashboardData";

interface PatientStatsProps {
  className?: string;
  data?: {
    new: number;
    returning: number;
    referred: number;
  };
}

export const PatientStats: React.FC<PatientStatsProps> = ({ 
  className,
  data 
}) => {
  // Use the dashboard data hook to fetch patient statistics
  const { patientStats, loading } = useDashboardData();
  
  // Use provided data prop if available, otherwise use the fetched data
  const statsData = data || patientStats;
  
  const chartData = [
    { name: "New", value: statsData.new, color: "hsl(var(--primary))" },
    { name: "Returning", value: statsData.returning, color: "#8EB8FF" },
    { name: "Referred", value: statsData.referred, color: "#C7DCFF" },
  ];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ 
    cx, 
    cy, 
    midAngle, 
    innerRadius, 
    outerRadius, 
    percent 
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor="middle" 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Calculate total patients
  const totalPatients = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle>Patient Demographics</CardTitle>
        <CardDescription>New vs returning patients</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-[240px]">
            <p className="text-muted-foreground">Loading patient data...</p>
          </div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={80}
                  innerRadius={40}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #f0f0f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                  }}
                  formatter={(value: number) => [`${value} patients`, '']}
                />
                <Legend 
                  layout="horizontal" 
                  verticalAlign="bottom" 
                  align="center"
                  wrapperStyle={{
                    paddingTop: "10px"
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="grid grid-cols-3 gap-4 mt-4">
              {chartData.map((item, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-bold">{item.value}</div>
                  <div className="text-xs text-muted-foreground">{item.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {(item.value / totalPatients * 100).toFixed(1)}%
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
