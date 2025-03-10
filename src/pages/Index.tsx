import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { CalendarDays, CheckCircle2, Clock, User, Users } from "lucide-react";

const data = [
  {
    name: "Jan",
    Appointments: 40,
    Patients: 24,
    amt: 24,
  },
  {
    name: "Feb",
    Appointments: 30,
    Patients: 13,
    amt: 22,
  },
  {
    name: "Mar",
    Appointments: 20,
    Patients: 98,
    amt: 22,
  },
  {
    name: "Apr",
    Appointments: 27,
    Patients: 39,
    amt: 20,
  },
  {
    name: "May",
    Appointments: 18,
    Patients: 48,
    amt: 21,
  },
  {
    name: "Jun",
    Appointments: 23,
    Patients: 38,
    amt: 25,
  },
  {
    name: "Jul",
    Appointments: 34,
    Patients: 43,
    amt: 21,
  },
  {
    name: "Aug",
    Appointments: 34,
    Patients: 43,
    amt: 21,
  },
  {
    name: "Sep",
    Appointments: 34,
    Patients: 43,
    amt: 21,
  },
  {
    name: "Oct",
    Appointments: 34,
    Patients: 43,
    amt: 21,
  },
  {
    name: "Nov",
    Appointments: 34,
    Patients: 43,
    amt: 21,
  },
  {
    name: "Dec",
    Appointments: 34,
    Patients: 43,
    amt: 21,
  },
];

const Index = () => {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Track key metrics and get a quick overview of your healthcare
            practice
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Total Appointments</CardTitle>
              <CardDescription>All time appointments</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center space-x-4 p-4">
              <CalendarDays className="h-10 w-10 text-blue-500" />
              <div className="space-y-1">
                <div className="text-2xl font-bold">4,520</div>
                <Badge variant="secondary">
                  <Clock className="h-4 w-4 mr-2" />
                  Updated 1 minute ago
                </Badge>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Patients</CardTitle>
              <CardDescription>All time patients</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center space-x-4 p-4">
              <Users className="h-10 w-10 text-green-500" />
              <div className="space-y-1">
                <div className="text-2xl font-bold">1,250</div>
                <Badge variant="secondary">
                  <Clock className="h-4 w-4 mr-2" />
                  Updated 1 minute ago
                </Badge>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
              <CardDescription>Appointments for today</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center space-x-4 p-4">
              <Clock className="h-10 w-10 text-orange-500" />
              <div className="space-y-1">
                <div className="text-2xl font-bold">27</div>
                <Badge variant="secondary">
                  Status: busy
                </Badge>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Completed Appointments</CardTitle>
              <CardDescription>Appointments completed today</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center space-x-4 p-4">
              <CheckCircle2 className="h-10 w-10 text-purple-500" />
              <div className="space-y-1">
                <div className="text-2xl font-bold">15</div>
                <Badge variant="secondary">
                  <Clock className="h-4 w-4 mr-2" />
                  Updated 1 minute ago
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardDescription>
              Monthly revenue and number of patients
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={data}
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
                <Bar dataKey="Appointments" fill="#8884d8" />
                <Bar dataKey="Patients" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Index;
