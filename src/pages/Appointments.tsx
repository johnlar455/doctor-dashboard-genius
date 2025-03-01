
import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AppointmentForm } from "@/components/appointments/AppointmentForm";
import { AppointmentCalendar } from "@/components/appointments/AppointmentCalendar";
import { AppointmentList } from "@/components/appointments/AppointmentList";
import { Button } from "@/components/ui/button";
import { CalendarDays, List } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

// Types
export type AppointmentStatus = "upcoming" | "completed" | "cancelled";

export interface Appointment {
  id: string;
  patientName: string;
  patientId: string;
  patientAvatar?: string;
  patientInitials: string;
  doctorName: string;
  doctorId: string;
  doctorAvatar?: string;
  doctorInitials: string;
  time: string;
  date: string;
  status: AppointmentStatus;
  type: string;
  notes?: string;
}

// Mock data for initial display
const mockAppointments: Appointment[] = [
  {
    id: "app-1",
    patientName: "Sarah Johnson",
    patientId: "p-001",
    patientInitials: "SJ",
    doctorName: "Dr. Michael Chen",
    doctorId: "d-001",
    doctorInitials: "MC",
    time: "09:00 AM",
    date: "2024-03-05",
    status: "upcoming",
    type: "General Checkup"
  },
  {
    id: "app-2",
    patientName: "Robert Williams",
    patientId: "p-002",
    patientInitials: "RW",
    doctorName: "Dr. Lisa Wong",
    doctorId: "d-002",
    doctorInitials: "LW",
    time: "11:30 AM",
    date: "2024-03-05",
    status: "upcoming",
    type: "Pediatric Consultation"
  },
  {
    id: "app-3",
    patientName: "Emily Davis",
    patientId: "p-003",
    patientInitials: "ED",
    doctorName: "Dr. James Wilson",
    doctorId: "d-003",
    doctorInitials: "JW",
    time: "02:15 PM",
    date: "2024-03-06",
    status: "upcoming",
    type: "Cardiology Follow-up"
  },
  {
    id: "app-4",
    patientName: "David Miller",
    patientId: "p-004",
    patientInitials: "DM",
    doctorName: "Dr. Michael Chen",
    doctorId: "d-001",
    doctorInitials: "MC",
    time: "10:00 AM",
    date: "2024-03-04",
    status: "completed",
    type: "Annual Physical"
  },
  {
    id: "app-5",
    patientName: "Jennifer Lopez",
    patientId: "p-005",
    patientInitials: "JL",
    doctorName: "Dr. Lisa Wong",
    doctorId: "d-002",
    doctorInitials: "LW",
    time: "03:30 PM",
    date: "2024-03-03",
    status: "cancelled",
    type: "Dermatology Consultation"
  }
];

const Appointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");

  // Handle creating a new appointment
  const handleCreateAppointment = (appointment: Omit<Appointment, "id">) => {
    const newAppointment = {
      ...appointment,
      id: `app-${appointments.length + 1}`,
    };
    
    setAppointments([...appointments, newAppointment]);
    setIsFormOpen(false);
    toast.success("Appointment scheduled successfully!");
  };

  // Handle updating an appointment
  const handleUpdateAppointment = (updatedAppointment: Appointment) => {
    setAppointments(
      appointments.map((app) => (app.id === updatedAppointment.id ? updatedAppointment : app))
    );
    setSelectedAppointment(null);
    toast.success("Appointment updated successfully!");
  };

  // Handle cancelling an appointment
  const handleCancelAppointment = (id: string) => {
    setAppointments(
      appointments.map((app) =>
        app.id === id ? { ...app, status: "cancelled" as AppointmentStatus } : app
      )
    );
    toast.success("Appointment cancelled successfully!");
  };

  // Handle selecting an appointment for editing
  const handleSelectAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsFormOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Appointments</h1>
            <p className="text-muted-foreground mt-1">
              Manage your appointments and schedule
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Tabs 
              value={viewMode} 
              onValueChange={(value) => setViewMode(value as "list" | "calendar")}
              className="hidden sm:flex"
            >
              <TabsList className="grid w-full grid-cols-2 h-9">
                <TabsTrigger value="list">
                  <List className="h-4 w-4 mr-2" />
                  List
                </TabsTrigger>
                <TabsTrigger value="calendar">
                  <CalendarDays className="h-4 w-4 mr-2" />
                  Calendar
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <Button 
              onClick={() => {
                setSelectedAppointment(null);
                setIsFormOpen(true);
              }}
            >
              New Appointment
            </Button>
          </div>
        </div>

        {isFormOpen ? (
          <AppointmentForm
            initialData={selectedAppointment}
            onSubmit={selectedAppointment ? handleUpdateAppointment : handleCreateAppointment}
            onCancel={() => {
              setIsFormOpen(false);
              setSelectedAppointment(null);
            }}
          />
        ) : (
          <>
            {viewMode === "list" ? (
              <AppointmentList
                appointments={appointments}
                onSelectAppointment={handleSelectAppointment}
                onCancelAppointment={handleCancelAppointment}
              />
            ) : (
              <AppointmentCalendar
                appointments={appointments}
                onSelectAppointment={handleSelectAppointment}
              />
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Appointments;
