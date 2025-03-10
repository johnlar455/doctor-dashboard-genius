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
import { Appointment, mapDatabaseAppointmentToFrontend, mapFrontendAppointmentToDatabase, AppointmentData } from "@/types/appointment";
import { Doctor } from "@/types/doctor";

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
          doctors(id, name, avatar, specialty, department, email, phone, bio, availability),
          patients(id, name, gender, age, email, phone, date_of_birth, status)
        `)
        .order('appointment_date', { ascending: true });

      if (error) throw error;

      // Transform the data to match our Appointment interface
      const mappedAppointments = data
        .filter(appointment => appointment.patients !== null)
        .map(appointment => mapDatabaseAppointmentToFrontend(appointment));

      setAppointments(mappedAppointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Failed to load appointments. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle creating a new appointment
  const handleCreateAppointment = async (appointmentData: Appointment) => {
    try {
      // Convert frontend appointment data to database format
      const dbAppointment = mapFrontendAppointmentToDatabase(appointmentData);
      
      // Calculate end time
      dbAppointment.end_time = calculateEndTime(appointmentData.time);
      
      // Ensure required fields are present and not undefined
      const appointmentToInsert = {
        doctor_id: dbAppointment.doctor_id!,
        patient_id: dbAppointment.patient_id!,
        appointment_date: dbAppointment.appointment_date!,
        start_time: dbAppointment.start_time!,
        end_time: dbAppointment.end_time!,
        type: dbAppointment.type!,
        status: dbAppointment.status!,
        notes: dbAppointment.notes
      };
      
      // Create a new appointment in the appointments table
      const { data, error } = await supabase
        .from('appointments')
        .insert(appointmentToInsert)
        .select()
        .single();

      if (error) throw error;

      // Get doctor and patient details
      const { data: doctor } = await supabase
        .from('doctors')
        .select('id, name, avatar, specialty, department, email, phone, bio, availability, created_at')
        .eq('id', appointmentData.doctorId)
        .single();

      const { data: patient } = await supabase
        .from('patients')
        .select('id, name')
        .eq('id', appointmentData.patientId)
        .single();

      // Create a full appointment object from the database response
      const newAppointment = mapDatabaseAppointmentToFrontend(data, doctor, patient);

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
      // Convert frontend appointment to database format
      const dbAppointment = mapFrontendAppointmentToDatabase(updatedAppointment);
      
      // Ensure all required fields are present for the update
      const appointmentToUpdate = {
        doctor_id: dbAppointment.doctor_id!,
        patient_id: dbAppointment.patient_id!,
        appointment_date: dbAppointment.appointment_date!,
        start_time: dbAppointment.start_time!,
        end_time: calculateEndTime(updatedAppointment.time),
        type: dbAppointment.type!,
        status: dbAppointment.status!,
        notes: dbAppointment.notes
      };
      
      // Update the appointment in the appointments table
      const { error } = await supabase
        .from('appointments')
        .update(appointmentToUpdate)
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
