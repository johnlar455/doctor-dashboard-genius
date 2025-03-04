
import React, { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Doctor } from "@/types/supabase";
import { format, isSameDay, startOfDay, endOfDay, addDays } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { LoadingState } from "@/components/patients/details/LoadingState";
import { supabase } from "@/integrations/supabase/client";

interface DoctorScheduleDialogProps {
  doctor: Doctor;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ScheduleSlot {
  id: string;
  date: Date;
  start: string;
  end: string;
  status: "available" | "booked" | "unavailable";
  patientId?: string;
  patientName?: string;
}

export const DoctorScheduleDialog: React.FC<DoctorScheduleDialogProps> = ({ 
  doctor,
  open, 
  onOpenChange
}) => {
  const [scheduleSlots, setScheduleSlots] = useState<ScheduleSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchDoctorSchedule = async () => {
      if (!open) return;
      
      try {
        setIsLoading(true);
        
        // Get the doctor's schedule from the database
        const { data, error } = await supabase
          .from('doctor_schedules')
          .select('*, patients(name)')
          .eq('doctor_id', doctor.id)
          .gte('slot_date', new Date().toISOString())
          .order('slot_date', { ascending: true });
        
        if (error) throw error;
        
        // If no schedules are found, generate default ones based on doctor availability
        if (!data || data.length === 0) {
          const today = new Date();
          const slots = generateDefaultSchedule(doctor, today);
          setScheduleSlots(slots);
        } else {
          // Map database results to schedule slots
          const slots = data.map(slot => ({
            id: slot.id,
            date: new Date(slot.slot_date),
            start: slot.start_time,
            end: slot.end_time,
            status: slot.status as "available" | "booked" | "unavailable",
            patientId: slot.patient_id,
            patientName: slot.patients?.name
          }));
          
          setScheduleSlots(slots);
        }
      } catch (err) {
        console.error('Error fetching doctor schedule:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDoctorSchedule();
  }, [doctor.id, open]);
  
  // Generate default schedule based on doctor availability
  const generateDefaultSchedule = (doctor: Doctor, startDate: Date): ScheduleSlot[] => {
    const slots: ScheduleSlot[] = [];
    const availableDays = doctor.availability.days;
    const startTime = doctor.availability.start;
    const endTime = doctor.availability.end;
    
    // Generate slots for the next 7 days
    for (let day = 0; day < 7; day++) {
      const currentDate = addDays(startDate, day);
      const dayName = format(currentDate, 'EEEE').toLowerCase();
      
      // Check if the doctor is available on this day
      if (availableDays.includes(dayName)) {
        // Generate hourly slots based on availability
        const [startHour, startMinute] = startTime.split(':').map(Number);
        const [endHour, endMinute] = endTime.split(':').map(Number);
        
        let slotDate = new Date(currentDate);
        slotDate.setHours(startHour, startMinute, 0);
        
        const endDateTime = new Date(currentDate);
        endDateTime.setHours(endHour, endMinute, 0);
        
        // Create hourly slots
        while (slotDate < endDateTime) {
          const slotStart = format(slotDate, 'HH:mm');
          
          const nextSlotDate = new Date(slotDate);
          nextSlotDate.setHours(slotDate.getHours() + 1);
          const slotEnd = format(nextSlotDate, 'HH:mm');
          
          // Randomly assign slot status for demo purposes
          const statusOptions: ("available" | "booked" | "unavailable")[] = ["available", "available", "available", "booked", "unavailable"];
          const randomStatus = statusOptions[Math.floor(Math.random() * statusOptions.length)];
          
          slots.push({
            id: `temp-${day}-${slotStart}`,
            date: new Date(slotDate),
            start: slotStart,
            end: slotEnd,
            status: randomStatus,
            patientName: randomStatus === "booked" ? `Patient ${Math.floor(Math.random() * 100)}` : undefined
          });
          
          slotDate = nextSlotDate;
        }
      }
    }
    
    return slots;
  };
  
  // Group slots by day
  const slotsByDay = scheduleSlots.reduce((acc, slot) => {
    const day = format(slot.date, 'yyyy-MM-dd');
    if (!acc[day]) {
      acc[day] = {
        date: slot.date,
        dayName: format(slot.date, 'EEEE'),
        slots: []
      };
    }
    acc[day].slots.push(slot);
    return acc;
  }, {} as Record<string, { date: Date; dayName: string; slots: ScheduleSlot[] }>);
  
  // Convert to array and sort by date
  const next5DaysSchedule = Object.values(slotsByDay)
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 5);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Doctor Schedule</DialogTitle>
          <DialogDescription>
            View upcoming appointments and availability
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex items-center gap-4 py-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={doctor.avatar} />
            <AvatarFallback className="text-lg">{getInitials(doctor.name)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg font-medium">{doctor.name}</h3>
            <p className="text-sm text-muted-foreground">{doctor.specialty} • {doctor.department}</p>
            <div className="flex items-center gap-2 mt-1 text-xs">
              <span>Availability:</span>
              {doctor.availability.days.map((day) => (
                <Badge key={day} variant="outline" className="capitalize text-xs">
                  {day.substring(0, 3)}
                </Badge>
              ))}
              <span className="ml-1">
                {doctor.availability.start} - {doctor.availability.end}
              </span>
            </div>
          </div>
        </div>
        
        {isLoading ? (
          <LoadingState />
        ) : (
          <div className="space-y-6">
            {next5DaysSchedule.length > 0 ? (
              next5DaysSchedule.map((day) => (
                <div key={day.dayName} className="space-y-2">
                  <h4 className="font-medium">
                    {day.dayName}, {format(day.date, "MMMM d")}
                    {isSameDay(day.date, new Date()) && (
                      <Badge className="ml-2">Today</Badge>
                    )}
                  </h4>
                  
                  {day.slots.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {day.slots.map((slot) => (
                        <div
                          key={slot.id}
                          className={cn(
                            "p-3 rounded-md border flex justify-between items-center",
                            slot.status === "available" && "border-green-200 bg-green-50",
                            slot.status === "booked" && "border-blue-200 bg-blue-50",
                            slot.status === "unavailable" && "border-gray-200 bg-gray-50"
                          )}
                        >
                          <div>
                            <div className="font-medium">
                              {slot.start} - {slot.end}
                            </div>
                            {slot.status === "booked" && slot.patientName && (
                              <div className="text-sm text-muted-foreground">
                                Patient: {slot.patientName}
                              </div>
                            )}
                          </div>
                          <Badge
                            className={cn(
                              slot.status === "available" && "bg-green-500",
                              slot.status === "booked" && "bg-blue-500",
                              slot.status === "unavailable" && "bg-gray-400"
                            )}
                          >
                            {slot.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-muted-foreground border rounded-md">
                      No slots available for this day.
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No schedule available. The doctor has not set their availability.
              </div>
            )}
          </div>
        )}
        
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
