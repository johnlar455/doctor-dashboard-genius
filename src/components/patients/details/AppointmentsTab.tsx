
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Loader2 } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface AppointmentProps {
  id: string;
  date: string;
  time: string;
  doctorName: string;
  doctorInitials: string;
  doctorAvatar?: string;
  type: string;
  status: "upcoming" | "completed" | "cancelled";
}

export const AppointmentsTab: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<AppointmentProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    
    const fetchPatientAppointments = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('doctor_schedules')
          .select(`
            id, 
            slot_date, 
            start_time, 
            end_time, 
            status,
            doctors(id, name, avatar)
          `)
          .eq('patient_id', id)
          .order('slot_date', { ascending: false });

        if (error) throw error;

        // Transform data to match our component needs
        const formattedAppointments = data.map(appointment => {
          const doctor = appointment.doctors;
          const doctorInitials = doctor.name
            .split(' ')
            .map(part => part[0])
            .join('')
            .toUpperCase();
          
          const appointmentDate = new Date(appointment.slot_date);
          
          return {
            id: appointment.id,
            date: format(appointmentDate, 'yyyy-MM-dd'),
            time: appointment.start_time,
            doctorName: doctor.name,
            doctorInitials,
            doctorAvatar: doctor.avatar,
            type: "Consultation", // Default type
            status: appointment.status === 'booked' 
              ? (appointmentDate > new Date() ? 'upcoming' : 'completed') 
              : 'cancelled'
          };
        });

        setAppointments(formattedAppointments);
      } catch (error) {
        console.error('Error fetching patient appointments:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatientAppointments();
  }, [id]);

  const handleScheduleAppointment = () => {
    navigate('/appointments', { state: { patientId: id } });
  };

  const getStatusBadge = (status: AppointmentProps["status"]) => {
    switch (status) {
      case "upcoming":
        return <Badge className="bg-blue-500">Upcoming</Badge>;
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>;
      case "cancelled":
        return <Badge className="bg-red-500">Cancelled</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg">Appointments</h3>
        <Button size="sm" onClick={handleScheduleAppointment}>
          <Calendar size={16} className="mr-2" />
          Schedule Appointment
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="ml-2">Loading appointments...</span>
        </div>
      ) : appointments.length > 0 ? (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div 
              key={appointment.id}
              className={cn(
                "p-4 rounded-lg border flex flex-wrap justify-between gap-4",
                appointment.status === "upcoming" ? "border-blue-200 bg-blue-50/50" :
                appointment.status === "completed" ? "border-green-200 bg-green-50/50" : 
                "border-red-200 bg-red-50/50"
              )}
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border border-border">
                  <AvatarImage src={appointment.doctorAvatar} alt={appointment.doctorName} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {appointment.doctorInitials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{appointment.doctorName}</div>
                  <div className="text-sm text-muted-foreground">
                    {appointment.date} at {appointment.time}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(appointment.status)}
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate(`/appointments?id=${appointment.id}`)}
                >
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          No upcoming appointments for this patient.
        </div>
      )}
    </div>
  );
};
