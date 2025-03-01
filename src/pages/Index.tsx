
import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { AppointmentList } from "@/components/dashboard/AppointmentList";
import { AnalyticsChart } from "@/components/dashboard/AnalyticsChart";
import { DoctorSchedule } from "@/components/dashboard/DoctorSchedule";
import { PatientStats } from "@/components/dashboard/PatientStats";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { CalendarDays, TrendingUp, Users, Activity } from "lucide-react";

const Index = () => {
  // Mock appointments data
  const appointments = [
    {
      id: "1",
      patientName: "Emma Wilson",
      patientInitials: "EW",
      time: "10:00 AM",
      date: "Today",
      status: "upcoming" as const,
      type: "General Checkup",
    },
    {
      id: "2",
      patientName: "Robert Johnson",
      patientInitials: "RJ",
      time: "11:30 AM",
      date: "Today",
      status: "upcoming" as const,
      type: "Cardiology",
    },
    {
      id: "3",
      patientName: "Sarah Miller",
      patientInitials: "SM",
      time: "1:00 PM",
      date: "Today",
      status: "upcoming" as const,
      type: "Dermatology",
    },
  ];

  // Mock schedule data
  const schedule = [
    {
      id: "1",
      time: "09:00 AM",
      patientName: "",
      patientInitials: "",
      type: "",
      status: "available" as const,
    },
    {
      id: "2",
      time: "10:00 AM",
      patientName: "Emma Wilson",
      patientInitials: "EW",
      type: "General Checkup",
      status: "busy" as const,
    },
    {
      id: "3",
      time: "11:30 AM",
      patientName: "Robert Johnson",
      patientInitials: "RJ",
      type: "Cardiology",
      status: "busy" as const,
    },
    {
      id: "4",
      time: "12:30 PM",
      patientName: "",
      patientInitials: "",
      type: "",
      status: "break" as const,
    },
    {
      id: "5",
      time: "01:00 PM",
      patientName: "Sarah Miller",
      patientInitials: "SM",
      type: "Dermatology",
      status: "busy" as const,
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, Dr. Smith! Here's what's happening today.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Appointments"
            value="32"
            change={{ value: "8%", positive: true }}
            description="vs last week"
            icon={CalendarDays}
            iconColor="text-primary"
            iconBg="bg-primary/10"
          />
          <StatCard
            title="New Patients"
            value="12"
            change={{ value: "10%", positive: true }}
            description="vs last week"
            icon={Users}
            iconColor="text-green-600"
            iconBg="bg-green-100"
          />
          <StatCard
            title="Patient Satisfaction"
            value="95%"
            change={{ value: "2%", positive: true }}
            description="vs last month"
            icon={TrendingUp}
            iconColor="text-amber-600"
            iconBg="bg-amber-100"
          />
          <StatCard
            title="Department Rank"
            value="#2"
            change={{ value: "1", positive: true }}
            description="position up"
            icon={Activity}
            iconColor="text-sky-600"
            iconBg="bg-sky-100"
          />
        </div>
        
        <div className="grid gap-6 lg:grid-cols-3">
          <AppointmentList 
            appointments={appointments} 
            className="lg:col-span-2 animate-slide-in" 
          />
          <QuickActions className="animate-slide-in [animation-delay:100ms]" />
        </div>
        
        <div className="grid gap-6 lg:grid-cols-3">
          <AnalyticsChart className="lg:col-span-2 animate-slide-in [animation-delay:150ms]" />
          <PatientStats className="animate-slide-in [animation-delay:200ms]" />
        </div>
        
        <div className="animate-slide-in [animation-delay:250ms]">
          <DoctorSchedule schedule={schedule} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
