
import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DoctorList } from "@/components/doctors/DoctorList";
import { DoctorCalendar } from "@/components/doctors/DoctorCalendar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AddDoctorDialog } from "@/components/doctors/AddDoctorDialog";
import { useToast } from "@/components/ui/use-toast";
import { Doctor } from "@/types/doctor";
import { Appointment } from "@/types/appointment";
import { supabase } from "@/integrations/supabase/client";

const Doctors = () => {
  const [isAddDoctorOpen, setIsAddDoctorOpen] = useState(false);
  const [doctorAdded, setDoctorAdded] = useState<boolean>(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Fetch appointments
  useEffect(() => {
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

        // Simple mapping for the calendar view
        const mappedAppointments = data.map(appt => ({
          id: appt.id,
          doctorId: appt.doctor_id,
          doctorName: appt.doctors?.name || 'Unknown Doctor',
          doctorInitials: appt.doctors?.name ? appt.doctors.name.charAt(0) : 'U',
          doctorAvatar: appt.doctors?.avatar || null,
          patientId: appt.patient_id,
          patientName: appt.patients?.name || 'Unknown Patient',
          patientInitials: appt.patients?.name ? appt.patients.name.charAt(0) : 'U',
          patientAvatar: null,
          date: appt.appointment_date,
          time: appt.start_time,
          status: appt.status as any,
          type: appt.type,
          notes: appt.notes || ""
        }));

        setAppointments(mappedAppointments);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        toast({
          title: "Error",
          description: "Failed to load appointments. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [toast]);

  const handleDoctorAdded = (doctor: Doctor) => {
    toast({
      title: "Doctor added successfully",
      description: `${doctor.name} has been added to the system.`
    });
    setDoctorAdded(true);
  };

  useEffect(() => {
    if (doctorAdded) {
      setDoctorAdded(false);
    }
  }, [doctorAdded]);

  const handleSelectAppointment = (appointment: Appointment) => {
    console.log('Selected appointment:', appointment);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Doctor Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage doctor profiles and schedules
            </p>
          </div>
          <Button onClick={() => setIsAddDoctorOpen(true)}>
            <Plus size={16} className="mr-1.5" />
            <span>Add Doctor</span>
          </Button>
        </div>
        
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-[400px] grid-cols-2">
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          </TabsList>
          <TabsContent value="list" className="mt-6">
            <DoctorList key={doctorAdded ? 'refreshed' : 'initial'} />
          </TabsContent>
          <TabsContent value="calendar" className="mt-6">
            <DoctorCalendar 
              doctors={doctors}
              appointments={appointments}
              onSelectAppointment={handleSelectAppointment}
              isLoading={isLoading}
            />
          </TabsContent>
        </Tabs>
      </div>

      <AddDoctorDialog 
        open={isAddDoctorOpen} 
        onOpenChange={setIsAddDoctorOpen} 
        onSuccess={handleDoctorAdded}
      />
    </DashboardLayout>
  );
};

export default Doctors;
