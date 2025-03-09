
import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { AppointmentList } from "@/components/dashboard/AppointmentList";
import { AnalyticsChart } from "@/components/dashboard/AnalyticsChart";
import { DoctorSchedule } from "@/components/dashboard/DoctorSchedule";
import { PatientStats } from "@/components/dashboard/PatientStats";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { CalendarDays, TrendingUp, Users, Activity, Loader2 } from "lucide-react";
import { useDashboardData } from "@/hooks/useDashboardData";
import { parseAvailability } from "@/types/supabase";
import { format } from "date-fns";

const Index = () => {
  const { 
    loading, 
    error, 
    appointments, 
    todayAppointments,
    stats, 
    patientStats,
    appointmentsByDay 
  } = useDashboardData();

  // Format appointments for display
  const formattedAppointments = appointments.slice(0, 3).map(appointment => ({
    id: appointment.id,
    patientName: appointment.patients?.name || "Unknown Patient",
    patientInitials: appointment.patients ? 
      appointment.patients.name.split(' ').map(n => n[0]).join('').toUpperCase() : "??",
    patientAvatar: null,
    time: appointment.start_time,
    date: appointment.appointment_date === format(new Date(), 'yyyy-MM-dd') 
      ? "Today" 
      : format(new Date(appointment.appointment_date), 'MMM dd'),
    status: appointment.status as "upcoming" | "completed" | "cancelled",
    type: appointment.type,
  }));

  // Format schedule for display
  const schedule = todayAppointments.map(appointment => ({
    id: appointment.id,
    time: appointment.start_time,
    patientName: appointment.patients?.name || "",
    patientInitials: appointment.patients ? 
      appointment.patients.name.split(' ').map(n => n[0]).join('').toUpperCase() : "",
    patientAvatar: null,
    type: appointment.type,
    status: "busy" as const,
  }));

  // Add available and break slots if needed
  if (schedule.length === 0) {
    // Default schedule when no appointments
    schedule.push(
      {
        id: "1",
        time: "09:00 AM",
        patientName: "",
        patientInitials: "",
        patientAvatar: null,
        type: "",
        status: "available" as const,
      },
      {
        id: "2", 
        time: "12:30 PM",
        patientName: "",
        patientInitials: "",
        patientAvatar: null,
        type: "",
        status: "break" as const,
      }
    );
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="h-full flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
            <p className="text-lg text-muted-foreground">Loading dashboard data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="h-full flex items-center justify-center">
          <div className="text-center max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-destructive mb-2">Error Loading Dashboard</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <button 
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

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
            value={stats.totalAppointments.toString()}
            change={{ value: "8%", positive: true }}
            description="vs last week"
            icon={CalendarDays}
            iconColor="text-primary"
            iconBg="bg-primary/10"
          />
          <StatCard
            title="New Patients"
            value={stats.newPatients.toString()}
            change={{ value: "10%", positive: true }}
            description="vs last week"
            icon={Users}
            iconColor="text-green-600"
            iconBg="bg-green-100"
          />
          <StatCard
            title="Patient Satisfaction"
            value={`${stats.patientSatisfaction}%`}
            change={{ value: "2%", positive: true }}
            description="vs last month"
            icon={TrendingUp}
            iconColor="text-amber-600"
            iconBg="bg-amber-100"
          />
          <StatCard
            title="Department Rank"
            value={`#${stats.departmentRank}`}
            change={{ value: "1", positive: true }}
            description="position up"
            icon={Activity}
            iconColor="text-sky-600"
            iconBg="bg-sky-100"
          />
        </div>
        
        <div className="grid gap-6 lg:grid-cols-3">
          <AppointmentList 
            appointments={formattedAppointments} 
            className="lg:col-span-2 animate-slide-in" 
          />
          <QuickActions className="animate-slide-in [animation-delay:100ms]" />
        </div>
        
        <div className="grid gap-6 lg:grid-cols-3">
          <AnalyticsChart 
            data={appointmentsByDay}
            className="lg:col-span-2 animate-slide-in [animation-delay:150ms]" 
          />
          <PatientStats 
            data={patientStats}
            className="animate-slide-in [animation-delay:200ms]" 
          />
        </div>
        
        <div className="animate-slide-in [animation-delay:250ms]">
          <DoctorSchedule schedule={schedule} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
