
import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Doctor, DoctorAvailability, parseDoctorAvailability, isDoctorAvailability } from "@/types/doctor";
import { Appointment } from "@/types/appointment";
import { format } from "date-fns";
import { LoadingState } from "@/components/analytics/shared/LoadingState";
import { cn } from "@/lib/utils";

interface DoctorCalendarProps {
  doctors: Doctor[];
  appointments: Appointment[];
  onSelectAppointment: (appointment: Appointment) => void;
  isLoading?: boolean;
}

export const DoctorCalendar: React.FC<DoctorCalendarProps> = ({
  doctors,
  appointments,
  onSelectAppointment,
  isLoading = false,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  // Format date for display and comparison
  const formattedSelectedDate = selectedDate 
    ? format(selectedDate, 'yyyy-MM-dd') 
    : '';
  
  // Filter appointments for the selected date
  const filteredAppointments = appointments.filter(
    (appointment) => appointment.date === formattedSelectedDate
  );

  const appointmentsByDoctor: Record<string, Appointment[]> = {};
  
  filteredAppointments.forEach((appointment) => {
    if (!appointmentsByDoctor[appointment.doctorId]) {
      appointmentsByDoctor[appointment.doctorId] = [];
    }
    appointmentsByDoctor[appointment.doctorId].push(appointment);
  });

  // Format date for the header
  const dateHeader = selectedDate 
    ? format(selectedDate, 'EEEE, MMMM d, yyyy')
    : 'Select a date';
  
  const timeSlots = Array.from({ length: 9 }, (_, i) => {
    const hour = i + 9; // Starting from 9 AM
    return `${hour}:00`;
  });

  // Get appointments for a specific doctor and time
  const getAppointmentForTimeSlot = (doctorId: string, time: string) =>
    appointmentsByDoctor[doctorId]?.find(
      (appointment) => appointment.time === time
    );

  const renderDoctorAvailability = (doctor: Doctor) => {
    // Safely extract availability
    let availability: DoctorAvailability;
    
    if (isDoctorAvailability(doctor.availability)) {
      availability = doctor.availability;
    } else {
      availability = parseDoctorAvailability(doctor.availability);
    }
    
    const availableDays = availability.days.map(day => day.toLowerCase());
    
    return (date: Date) => {
      const day = format(date, 'EEEE').toLowerCase();
      return availableDays.includes(day);
    };
  };

  if (isLoading) {
    return <LoadingState message="Loading calendar..." />;
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>Select Date</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
          />
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>{dateHeader}</CardTitle>
        </CardHeader>
        <CardContent>
          {doctors.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="py-2 px-3 text-left font-medium text-sm">Time</th>
                    {doctors.map((doctor) => (
                      <th key={doctor.id} className="py-2 px-3 text-left font-medium text-sm">
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={doctor.avatar || undefined} alt={doctor.name} />
                            <AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span>{doctor.name}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {timeSlots.map((time) => (
                    <tr key={time} className="border-t">
                      <td className="py-2 px-3">{time}</td>
                      {doctors.map((doctor) => {
                        const appointment = getAppointmentForTimeSlot(doctor.id, time);
                        
                        return (
                          <td 
                            key={`${doctor.id}-${time}`} 
                            className={cn(
                              "py-2 px-3",
                              appointment ? "cursor-pointer hover:bg-muted/50" : ""
                            )}
                            onClick={() => appointment && onSelectAppointment(appointment)}
                          >
                            {appointment ? (
                              <div className="flex items-center space-x-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarFallback>{appointment.patientInitials}</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                  <span className="text-sm font-medium">{appointment.patientName}</span>
                                  <div className="flex items-center space-x-1">
                                    <Badge 
                                      variant="outline" 
                                      className={cn(
                                        appointment.status === "completed" && "bg-green-100 text-green-800 border-green-300",
                                        appointment.status === "cancelled" && "bg-red-100 text-red-800 border-red-300",
                                        appointment.status === "upcoming" && "bg-blue-100 text-blue-800 border-blue-300"
                                      )}
                                    >
                                      {appointment.status}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">{appointment.type}</span>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="h-[38px]"></div> // Empty cell with same height as appointments
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              No doctors available. Please add doctors first.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
