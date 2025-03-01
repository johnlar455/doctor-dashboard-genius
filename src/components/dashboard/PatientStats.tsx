
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface PatientStatsProps {
  className?: string;
}

export const PatientStats: React.FC<PatientStatsProps> = ({ className }) => {
  const data = [
    { name: "New", value: 30, color: "hsl(var(--primary))" },
    { name: "Returning", value: 65, color: "#8EB8FF" },
    { name: "Referred", value: 15, color: "#C7DCFF" },
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

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle>Patient Demographics</CardTitle>
        <CardDescription>New vs returning patients</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={80}
              innerRadius={40}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
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
                paddingTop: "20px"
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
