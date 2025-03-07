
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface MonthlyRevenueChartProps {
  monthlyRevenueData: Array<{
    name: string;
    revenue: number;
    expenses: number;
    profit: number;
  }>;
  formatCurrency: (value: number) => string;
}

export const MonthlyRevenueChart: React.FC<MonthlyRevenueChartProps> = ({ 
  monthlyRevenueData, 
  formatCurrency 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Revenue Trends</CardTitle>
        <CardDescription>
          Revenue, expenses, and profit over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={monthlyRevenueData}
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
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#3b82f6" 
                name="Revenue" 
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="expenses" 
                stroke="#ef4444" 
                name="Expenses" 
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="profit" 
                stroke="#10b981" 
                name="Profit" 
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
