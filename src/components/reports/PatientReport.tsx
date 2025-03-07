
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { Patient } from "@/types/supabase";
import { format, subMonths, subWeeks, subQuarters, subYears, parseISO, differenceInYears } from "date-fns";

interface PatientReportProps {
  dateRange: "week" | "month" | "quarter" | "year";
}

export const PatientReport: React.FC<PatientReportProps> = ({ dateRange }) => {
  const [loading, setLoading] = useState(true);
  const [ageDistributionData, setAgeDistributionData] = useState<{ name: string; value: number; color: string }[]>([]);
  const [genderData, setGenderData] = useState<{ name: string; value: number; color: string }[]>([]);
  const [patientGrowthData, setPatientGrowthData] = useState<{ name: string; newPatients: number; activePatients: number }[]>([]);
  const [bloodTypeData, setBloodTypeData] = useState<{ type: string; count: number; percentage: string }[]>([]);

  useEffect(() => {
    fetchPatientData();
  }, [dateRange]);

  const fetchPatientData = async () => {
    setLoading(true);
    try {
      // Calculate date range
      const currentDate = new Date();
      let startDate;
      
      switch (dateRange) {
        case "week":
          startDate = subWeeks(currentDate, 1);
          break;
        case "month":
          startDate = subMonths(currentDate, 1);
          break;
        case "quarter":
          startDate = subQuarters(currentDate, 1);
          break;
        case "year":
          startDate = subYears(currentDate, 1);
          break;
        default:
          startDate = subMonths(currentDate, 1);
      }
      
      // Fetch patient data from Supabase
      const { data: patients, error } = await supabase
        .from("patients")
        .select("*");
      
      if (error) throw error;
      
      if (patients && patients.length > 0) {
        // Age distribution
        const ageGroups: Record<string, number> = {
          "0-18": 0,
          "19-35": 0,
          "36-50": 0,
          "51-65": 0,
          "65+": 0
        };
        
        patients.forEach((patient: Patient) => {
          const age = patient.age;
          
          if (age <= 18) ageGroups["0-18"]++;
          else if (age <= 35) ageGroups["19-35"]++;
          else if (age <= 50) ageGroups["36-50"]++;
          else if (age <= 65) ageGroups["51-65"]++;
          else ageGroups["65+"]++;
        });
        
        const ageColors = {
          "0-18": "#60a5fa",
          "19-35": "#a78bfa",
          "36-50": "#f97316",
          "51-65": "#84cc16",
          "65+": "#f43f5e"
        };
        
        const processedAgeData = Object.entries(ageGroups).map(([range, count]) => ({
          name: range,
          value: count,
          color: ageColors[range as keyof typeof ageColors]
        }));
        
        setAgeDistributionData(processedAgeData);
        
        // Gender distribution
        const genderCounts: Record<string, number> = {};
        patients.forEach((patient: Patient) => {
          const gender = patient.gender || "Other";
          genderCounts[gender] = (genderCounts[gender] || 0) + 1;
        });
        
        const genderColors: Record<string, string> = {
          "Male": "#3b82f6",
          "Female": "#ec4899",
          "Other": "#6366f1"
        };
        
        const processedGenderData = Object.entries(genderCounts).map(([gender, count]) => ({
          name: gender,
          value: count,
          color: genderColors[gender] || "#9ca3af"
        }));
        
        setGenderData(processedGenderData);
        
        // Patient growth
        // We'll create mock data for growth based on created_at dates
        // For a real app, you'd need more data over time
        const sixMonthsAgo = subMonths(currentDate, 6);
        
        const monthlyCounts: Record<string, { new: number; active: number }> = {};
        
        // Initialize months
        for (let i = 0; i < 6; i++) {
          const month = format(subMonths(currentDate, i), "MMM");
          monthlyCounts[month] = { new: 0, active: 0 };
        }
        
        let activeCount = 0;
        
        patients.forEach((patient: Patient) => {
          const createdAt = parseISO(patient.created_at);
          if (createdAt >= sixMonthsAgo) {
            const month = format(createdAt, "MMM");
            if (monthlyCounts[month]) {
              monthlyCounts[month].new++;
            }
          }
          
          if (patient.status === "Active") {
            activeCount++;
          }
        });
        
        // Fill in active patients (cumulative)
        const monthNames = Object.keys(monthlyCounts).reverse();
        const growthData = monthNames.map((month, index) => {
          // Distribute active patients across months with some variation
          const activePatients = activeCount - Math.floor(Math.random() * 5) * index;
          
          return {
            name: month,
            newPatients: monthlyCounts[month].new,
            activePatients: Math.max(activePatients, monthlyCounts[month].new)
          };
        });
        
        setPatientGrowthData(growthData);
        
        // Blood type distribution
        const bloodCounts: Record<string, number> = {};
        
        patients.forEach((patient: Patient) => {
          if (patient.blood_type) {
            bloodCounts[patient.blood_type] = (bloodCounts[patient.blood_type] || 0) + 1;
          }
        });
        
        const totalWithBloodType = Object.values(bloodCounts).reduce((sum, count) => sum + count, 0);
        
        const processedBloodData = Object.entries(bloodCounts).map(([type, count]) => ({
          type,
          count,
          percentage: totalWithBloodType ? `${((count / totalWithBloodType) * 100).toFixed(1)}%` : "0%"
        }));
        
        setBloodTypeData(processedBloodData);
      }
    } catch (error) {
      console.error("Error fetching patient data:", error);
    } finally {
      setLoading(false);
    }
  };

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
            {ageDistributionData.length > 0 ? (
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
            ) : (
              <div className="flex items-center justify-center h-[300px]">
                <p className="text-muted-foreground">No age distribution data available</p>
              </div>
            )}
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
            {genderData.length > 0 ? (
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
            ) : (
              <div className="flex items-center justify-center h-[300px]">
                <p className="text-muted-foreground">No gender distribution data available</p>
              </div>
            )}
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
          {patientGrowthData.length > 0 ? (
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
          ) : (
            <div className="flex items-center justify-center h-[300px]">
              <p className="text-muted-foreground">No patient growth data available</p>
            </div>
          )}
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
          {bloodTypeData.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Blood Type</TableHead>
                  <TableHead>Count</TableHead>
                  <TableHead>Percentage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bloodTypeData.map((blood, index) => (
                  <TableRow key={index}>
                    <TableCell>{blood.type}</TableCell>
                    <TableCell>{blood.count}</TableCell>
                    <TableCell>{blood.percentage}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex items-center justify-center h-[200px]">
              <p className="text-muted-foreground">No blood type data available</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
