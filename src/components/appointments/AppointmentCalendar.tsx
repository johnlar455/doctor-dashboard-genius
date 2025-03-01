
import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Appointment } from "@/pages/Appointments";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

interface AppointmentCalendarProps {
  appointments: Appointment[];
  onSelectAppointment: (appointment: Appointment) => void;
}

export const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({
  appointments,
  onSelectAppointment,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Group appointments by date
  const appointmentsByDate = appointments.reduce((acc, appointment) => {
    const date = appointment.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(appointment);
    return acc;
  }, {} as Record<string, Appointment[]>);

  // Get appointments for the selected date
  const getAppointmentsForDate = (date: Date | undefined) => {
    if (!date) return [];
    
    const dateStr = format(date, "yyyy-MM-dd");
    return appointmentsByDate[dateStr] || [];
  };

  // Calendar rendering functions
  const renderDateContent = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const dateAppointments = appointmentsByDate[dateStr] || [];

    if (dateAppointments.length === 0) return null;

    const hasUpcoming = dateAppointments.some(a => a.status === "upcoming");
    
    return (
      <div className="absolute bottom-0 left-0 right-0 flex justify-center">
        <div 
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            hasUpcoming ? "bg-primary" : "bg-muted-foreground"
          )}
        />
      </div>
    );
  };

  // Sort appointments by time for the current date
  const selectedDateAppointments = getAppointmentsForDate(selectedDate)
    .sort((a, b) => {
      // Simple time comparison - in a real app you might want to use a more robust approach
      return a.time.localeCompare(b.time);
    });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Select Date</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
            components={{
              DayContent: ({ date }) => (
                <div className="relative h-full w-full p-2">
                  <div>{date.getDate()}</div>
                  {renderDateContent(date)}
                </div>
              ),
            }}
          />
        </CardContent>
      </Card>

      <Card className="col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle>
            {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "No Date Selected"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedDateAppointments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No appointments for this date</p>
            </div>
          ) : (
            <div className="space-y-6">
              {selectedDateAppointments.map((appointment) => (
                <div key={appointment.id} className="relative flex">
                  <div className="flex flex-col items-center mr-4">
                    <div className="flex-none w-16 text-sm font-medium">
                      {appointment.time}
                    </div>
                    <div className={cn(
                      "mt-1 h-full w-px",
                      appointment.status === "upcoming" ? "bg-primary" :
                      appointment.status === "completed" ? "bg-green-400" : "bg-red-400"
                    )} />
                  </div>
                  
                  <div className={cn(
                    "flex-1 p-4 rounded-lg border",
                    appointment.status === "upcoming" ? "border-blue-200 bg-blue-50/50" :
                    appointment.status === "completed" ? "border-green-200 bg-green-50/50" : 
                    "border-red-200 bg-red-50/50"
                  )}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10 border border-border">
                          <AvatarImage src={appointment.patientAvatar} alt={appointment.patientName} />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {appointment.patientInitials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{appointment.patientName}</div>
                          <div className="text-sm text-muted-foreground">{appointment.type}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">
                          {appointment.status === "upcoming" ? (
                            <Clock className="mr-1 h-3 w-3" />
                          ) : null}
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </Badge>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => onSelectAppointment(appointment)}
                        >
                          Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
