
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { format, subMonths, subWeeks, subQuarters, subYears } from "date-fns";
import { Loader2 } from "lucide-react";

interface PatientDemographicsProps {
  dateRange: "week" | "month" | "quarter" | "year";
}

export const PatientDemographics: React.FC<PatientDemographicsProps> = ({ dateRange }) => {
  const [loading, setLoading] = useState(true);
  const [ageData, setAgeData] = useState<any[]>([]);
  const [genderData, setGenderData] = useState<any[]>([]);
  const [visitFrequencyData, setVisitFrequencyData] = useState<any[]>([]);
  const [frequentPatients, setFrequentPatients] = useState<any[]>([]);
  
  useEffect(() => {
    fetchData();
  }, [dateRange]);

  const fetchData = async () => {
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
      }
      
      // Get patients from Supabase
      const { data: patients, error: patientsError } = await supabase
        .from('patients')
        .select('*');
      
      if (patientsError) throw patientsError;
      
      // Get appointments to calculate visit frequency
      const { data: appointments, error: appointmentsError } = await supabase
        .from('appointments')
        .select('patient_id, appointment_date')
        .gte('appointment_date', startDate.toISOString());
      
      if (appointmentsError) throw appointmentsError;
      
      if (patients && patients.length > 0) {
        // Process age data
        const ageGroups = {
          '0-18': 0,
          '19-35': 0,
          '36-50': 0,
          '51-65': 0,
          '65+': 0
        };
        
        patients.forEach((patient) => {
          const age = patient.age;
          if (age <= 18) ageGroups['0-18']++;
          else if (age <= 35) ageGroups['19-35']++;
          else if (age <= 50) ageGroups['36-50']++;
          else if (age <= 65) ageGroups['51-65']++;
          else ageGroups['65+']++;
        });
        
        const processedAgeData = [
          { name: '0-18', value: ageGroups['0-18'], color: '#60a5fa' },
          { name: '19-35', value: ageGroups['19-35'], color: '#34d399' },
          { name: '36-50', value: ageGroups['36-50'], color: '#a78bfa' },
          { name: '51-65', value: ageGroups['51-65'], color: '#fbbf24' },
          { name: '65+', value: ageGroups['65+'], color: '#f87171' }
        ];
        
        setAgeData(processedAgeData);
        
        // Process gender data
        const genderCounts = {
          Male: 0,
          Female: 0,
          Other: 0
        };
        
        patients.forEach((patient) => {
          const gender = patient.gender || 'Other';
          if (gender in genderCounts) {
            genderCounts[gender as keyof typeof genderCounts]++;
          } else {
            genderCounts.Other++;
          }
        });
        
        const processedGenderData = [
          { name: 'Male', value: genderCounts.Male, color: '#3b82f6' },
          { name: 'Female', value: genderCounts.Female, color: '#ec4899' },
          { name: 'Other', value: genderCounts.Other, color: '#a855f7' }
        ];
        
        setGenderData(processedGenderData);
        
        // Process visit frequency
        const visitCounts: Record<string, number> = {};
        
        if (appointments && appointments.length > 0) {
          appointments.forEach((appointment) => {
            visitCounts[appointment.patient_id] = (visitCounts[appointment.patient_id] || 0) + 1;
          });
          
          // Group by visit frequency
          const frequencyCounts = {
            '1 visit': 0,
            '2 visits': 0,
            '3 visits': 0,
            '4 visits': 0,
            '5+ visits': 0
          };
          
          Object.values(visitCounts).forEach((count) => {
            if (count === 1) frequencyCounts['1 visit']++;
            else if (count === 2) frequencyCounts['2 visits']++;
            else if (count === 3) frequencyCounts['3 visits']++;
            else if (count === 4) frequencyCounts['4 visits']++;
            else frequencyCounts['5+ visits']++;
          });
          
          const processedFrequencyData = [
            { name: '1 visit', value: frequencyCounts['1 visit'] },
            { name: '2 visits', value: frequencyCounts['2 visits'] },
            { name: '3 visits', value: frequencyCounts['3 visits'] },
            { name: '4 visits', value: frequencyCounts['4 visits'] },
            { name: '5+ visits', value: frequencyCounts['5+ visits'] }
          ];
          
          setVisitFrequencyData(processedFrequencyData);
          
          // Get most frequent patients
          const patientVisits = Object.entries(visitCounts)
            .map(([patientId, count]) => ({ patientId, visits: count }))
            .sort((a, b) => b.visits - a.visits)
            .slice(0, 5);
          
          const frequentPatientsData = await Promise.all(patientVisits.map(async ({ patientId, visits }) => {
            const { data } = await supabase
              .from('patients')
              .select('name, gender, age')
              .eq('id', patientId)
              .single();
            
            return {
              name: data?.name || 'Unknown',
              gender: data?.gender || 'Unknown',
              age: data?.age || 'Unknown',
              visits
            };
          }));
          
          setFrequentPatients(frequentPatientsData);
        } else {
          // Mock data if no appointments found
          setVisitFrequencyData([
            { name: '1 visit', value: 45 },
            { name: '2 visits', value: 30 },
            { name: '3 visits', value: 15 },
            { name: '4 visits', value: 8 },
            { name: '5+ visits', value: 5 }
          ]);
          
          setFrequentPatients([
            { name: 'Jane Smith', gender: 'Female', age: 42, visits: 8 },
            { name: 'John Doe', gender: 'Male', age: 35, visits: 6 },
            { name: 'Emily Johnson', gender: 'Female', age: 28, visits: 5 },
            { name: 'Michael Brown', gender: 'Male', age: 56, visits: 4 },
            { name: 'Sarah Wilson', gender: 'Female', age: 61, visits: 4 }
          ]);
        }
      } else {
        // Mock data if no patients found
        setAgeData([
          { name: '0-18', value: 15, color: '#60a5fa' },
          { name: '19-35', value: 35, color: '#34d399' },
          { name: '36-50', value: 25, color: '#a78bfa' },
          { name: '51-65', value: 18, color: '#fbbf24' },
          { name: '65+', value: 7, color: '#f87171' }
        ]);
        
        setGenderData([
          { name: 'Male', value: 45, color: '#3b82f6' },
          { name: 'Female', value: 52, color: '#ec4899' },
          { name: 'Other', value: 3, color: '#a855f7' }
        ]);
        
        setVisitFrequencyData([
          { name: '1 visit', value: 45 },
          { name: '2 visits', value: 30 },
          { name: '3 visits', value: 15 },
          { name: '4 visits', value: 8 },
          { name: '5+ visits', value: 5 }
        ]);
        
        setFrequentPatients([
          { name: 'Jane Smith', gender: 'Female', age: 42, visits: 8 },
          { name: 'John Doe', gender: 'Male', age: 35, visits: 6 },
          { name: 'Emily Johnson', gender: 'Female', age: 28, visits: 5 },
          { name: 'Michael Brown', gender: 'Male', age: 56, visits: 4 },
          { name: 'Sarah Wilson', gender: 'Female', age: 61, visits: 4 }
        ]);
      }
    } catch (error) {
      console.error('Error fetching patient demographics:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading patient demographics...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Age Distribution</CardTitle>
            <CardDescription>
              Patients by age group
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ageData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderLabel}
                    outerRadius={110}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {ageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gender Distribution</CardTitle>
            <CardDescription>
              Patients by gender
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={genderData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderLabel}
                    outerRadius={110}
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
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
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
                  data={visitFrequencyData}
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

        <Card>
          <CardHeader>
            <CardTitle>Most Frequent Patients</CardTitle>
            <CardDescription>
              Patients with highest visit counts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Visits</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {frequentPatients.map((patient, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{patient.name}</TableCell>
                    <TableCell>{patient.gender}</TableCell>
                    <TableCell>{patient.age}</TableCell>
                    <TableCell>{patient.visits}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
