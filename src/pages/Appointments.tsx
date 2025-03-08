
import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AppointmentForm } from "@/components/appointments/AppointmentForm";
import { AppointmentCalendar } from "@/components/appointments/AppointmentCalendar";
import { AppointmentList } from "@/components/appointments/AppointmentList";
import { Button } from "@/components/ui/button";
import { CalendarDays, List } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Doctor, Patient, Appointment, AppointmentData } from "@/types/supabase";

// Types
export type AppointmentStatus = "upcoming" | "completed" | "cancelled";

const Appointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch appointments from Supabase
  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          id, 
          appointment_date, 
          start_time, 
          end_time, 
          type,
          status,
          notes,
          doctor_id,
          patient_id,
          doctors(id, name, avatar),
          patients(id, name)
        `)
        .order('appointment_date', { ascending: true });

      if (error) throw error;

      // Transform the data to match our Appointment interface
      const mappedAppointments = data
        .filter(appointment => appointment.patients !== null)
        .map(appointment => {
          const doctor = appointment.doctors;
          const patient = appointment.patients;
          
          // Extract initials for doctor and patient
          const doctorInitials = doctor.name
            .split(' ')
            .map(part => part[0])
            .join('')
            .toUpperCase();
            
          const patientInitials = patient ? patient.name
            .split(' ')
            .map(part => part[0])
            .join('')
            .toUpperCase() : '';

          return {
            id: appointment.id,
            patientName: patient ? patient.name : '',
            patientId: appointment.patient_id,
            patientInitials: patientInitials,
            doctorName: doctor.name,
            doctorId: appointment.doctor_id,
            doctorAvatar: doctor.avatar,
            doctorInitials: doctorInitials,
            time: appointment.start_time,
            date: appointment.appointment_date,
            status: appointment.status as AppointmentStatus,
            type: appointment.type,
            notes: appointment.notes || ""
          };
        });

      setAppointments(mappedAppointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Failed to load appointments. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle creating a new appointment
  const handleCreateAppointment = async (appointmentData: Omit<Appointment, "id" | "patientInitials" | "doctorInitials">) => {
    try {
      // Create a new appointment in the appointments table
      const { data, error } = await supabase
        .from('appointments')
        .insert({
          doctor_id: appointmentData.doctorId,
          patient_id: appointmentData.patientId,
          appointment_date: appointmentData.date,
          start_time: appointmentData.time,
          end_time: calculateEndTime(appointmentData.time),
          type: appointmentData.type,
          status: 'upcoming',
          notes: appointmentData.notes
        })
        .select()
        .single();

      if (error) throw error;

      // Get doctor and patient details
      const { data: doctor } = await supabase
        .from('doctors')
        .select('name, avatar')
        .eq('id', appointmentData.doctorId)
        .single();

      const { data: patient } = await supabase
        .from('patients')
        .select('name')
        .eq('id', appointmentData.patientId)
        .single();

      // Calculate initials
      const doctorInitials = doctor.name
        .split(' ')
        .map(part => part[0])
        .join('')
        .toUpperCase();
        
      const patientInitials = patient.name
        .split(' ')
        .map(part => part[0])
        .join('')
        .toUpperCase();

      // Add the new appointment to the state
      const newAppointment: Appointment = {
        id: data.id,
        patientName: patient.name,
        patientId: appointmentData.patientId,
        patientInitials: patientInitials,
        doctorName: doctor.name,
        doctorId: appointmentData.doctorId,
        doctorAvatar: doctor.avatar,
        doctorInitials: doctorInitials,
        time: appointmentData.time,
        date: appointmentData.date,
        status: 'upcoming',
        type: appointmentData.type,
        notes: appointmentData.notes
      };

      setAppointments([...appointments, newAppointment]);
      setIsFormOpen(false);
      toast.success("Appointment scheduled successfully!");
      
      // Refresh the appointments list to ensure we have the latest data
      fetchAppointments();
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast.error('Failed to create appointment. Please try again.');
    }
  };

  // Calculate end time (1 hour after start time)
  const calculateEndTime = (startTime: string) => {
    const [hours, minutes] = startTime.split(':');
    const hourValue = parseInt(hours);
    const isPM = startTime.toLowerCase().includes('pm');
    
    let hour24 = isPM && hourValue !== 12 ? hourValue + 12 : hourValue;
    let nextHour = (hour24 + 1) % 24;
    
    // Format back to 12-hour format
    return `${nextHour === 0 ? 12 : nextHour > 12 ? nextHour - 12 : nextHour}:${minutes} ${nextHour >= 12 ? 'PM' : 'AM'}`;
  };

  // Handle updating an appointment
  const handleUpdateAppointment = async (updatedAppointment: Appointment) => {
    try {
      // Update the appointment in the appointments table
      const { error } = await supabase
        .from('appointments')
        .update({
          doctor_id: updatedAppointment.doctorId,
          patient_id: updatedAppointment.patientId,
          appointment_date: updatedAppointment.date,
          start_time: updatedAppointment.time,
          end_time: calculateEndTime(updatedAppointment.time),
          type: updatedAppointment.type,
          status: updatedAppointment.status,
          notes: updatedAppointment.notes
        })
        .eq('id', updatedAppointment.id);

      if (error) throw error;

      // Update the appointment in the state
      setAppointments(
        appointments.map((app) => (app.id === updatedAppointment.id ? updatedAppointment : app))
      );
      setSelectedAppointment(null);
      toast.success("Appointment updated successfully!");
    } catch (error) {
      console.error('Error updating appointment:', error);
      toast.error('Failed to update appointment. Please try again.');
    }
  };

  // Handle cancelling an appointment
  const handleCancelAppointment = async (id: string) => {
    try {
      // Update the appointment status in the appointments table
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'cancelled' })
        .eq('id', id);

      if (error) throw error;

      // Update the appointment in the state
      setAppointments(
        appointments.map((app) =>
          app.id === id ? { ...app, status: "cancelled" as AppointmentStatus } : app
        )
      );
      toast.success("Appointment cancelled successfully!");
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      toast.error('Failed to cancel appointment. Please try again.');
    }
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
                isLoading={isLoading}
              />
            ) : (
              <AppointmentCalendar
                appointments={appointments}
                onSelectAppointment={handleSelectAppointment}
                isLoading={isLoading}
              />
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Appointments;
