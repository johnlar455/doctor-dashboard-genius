
import React from "react";
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
import { Doctor, mockSchedules } from "@/data/doctors";
import { format, isSameDay, startOfDay, endOfDay, addDays } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface DoctorScheduleDialogProps {
  doctor: Doctor;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DoctorScheduleDialog: React.FC<DoctorScheduleDialogProps> = ({ 
  doctor,
  open, 
  onOpenChange
}) => {
  const doctorSchedule = mockSchedules[doctor.id];
  const today = new Date();
  
  // Get schedule for the next 5 days
  const next5DaysSchedule = [] as {
    date: Date;
    dayName: string;
    slots: typeof doctorSchedule.slots;
  }[];
  
  for (let i = 0; i < 5; i++) {
    const currentDate = addDays(today, i);
    const dayStart = startOfDay(currentDate);
    const dayEnd = endOfDay(currentDate);
    
    const slotsForDay = doctorSchedule.slots.filter(
      slot => isSameDay(slot.date, currentDate)
    ).sort((a, b) => a.start.localeCompare(b.start));
    
    next5DaysSchedule.push({
      date: currentDate,
      dayName: format(currentDate, 'EEEE'),
      slots: slotsForDay
    });
  }
  
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
        
        <div className="space-y-6">
          {next5DaysSchedule.map((day) => (
            <div key={day.dayName} className="space-y-2">
              <h4 className="font-medium">
                {day.dayName}, {format(day.date, "MMMM d")}
                {isSameDay(day.date, today) && (
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
          ))}
        </div>
        
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
