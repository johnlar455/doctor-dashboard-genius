
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockPatients } from "@/data/patients";

interface PatientReportProps {
  dateRange: "week" | "month" | "quarter" | "year";
}

export const PatientReport: React.FC<PatientReportProps> = ({ dateRange }) => {
  // Mock data for age distribution
  const ageDistributionData = [
    { name: "0-18", value: 15, color: "#60a5fa" },
    { name: "19-35", value: 25, color: "#a78bfa" },
    { name: "36-50", value: 30, color: "#f97316" },
    { name: "51-65", value: 20, color: "#84cc16" },
    { name: "65+", value: 10, color: "#f43f5e" },
  ];

  // Mock data for patient growth
  const patientGrowthData = [
    { name: "Jan", newPatients: 15, activePatients: 50 },
    { name: "Feb", newPatients: 20, activePatients: 65 },
    { name: "Mar", newPatients: 25, activePatients: 80 },
    { name: "Apr", newPatients: 18, activePatients: 90 },
    { name: "May", newPatients: 22, activePatients: 100 },
    { name: "Jun", newPatients: 30, activePatients: 120 },
  ];

  // Calculate gender distribution from mock data
  const genderCount = mockPatients.reduce((acc, patient) => {
    const gender = patient.gender;
    acc[gender] = (acc[gender] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const genderData = Object.entries(genderCount).map(([gender, count]) => ({
    name: gender,
    value: count,
    color: gender === "Male" ? "#3b82f6" : "#ec4899"
  }));

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Age Distribution</CardTitle>
            <CardDescription>
              Patient demographics by age group
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={ageDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {ageDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gender Distribution</CardTitle>
            <CardDescription>
              Patient demographics by gender
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {genderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Patient Growth Trends</CardTitle>
          <CardDescription>
            New and active patients over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={patientGrowthData}
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
              <Line type="monotone" dataKey="newPatients" stroke="#8884d8" name="New Patients" />
              <Line type="monotone" dataKey="activePatients" stroke="#82ca9d" name="Active Patients" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Blood Type Distribution</CardTitle>
          <CardDescription>
            Distribution of patients by blood type
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Blood Type</TableHead>
                <TableHead>Count</TableHead>
                <TableHead>Percentage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { type: "O+", count: 2, percentage: "33.3%" },
                { type: "A+", count: 1, percentage: "16.7%" },
                { type: "A-", count: 1, percentage: "16.7%" },
                { type: "AB+", count: 1, percentage: "16.7%" },
                { type: "B+", count: 1, percentage: "16.7%" },
              ].map((blood, index) => (
                <TableRow key={index}>
                  <TableCell>{blood.type}</TableCell>
                  <TableCell>{blood.count}</TableCell>
                  <TableCell>{blood.percentage}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
