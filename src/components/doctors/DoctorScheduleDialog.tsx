
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { Doctor as DoctorType, DoctorAvailability, parseDoctorAvailability, isDoctorAvailability } from "@/types/doctor";
import { Doctor as SupabaseDoctor } from "@/types/supabase";

interface DoctorScheduleDialogProps {
  doctor: DoctorType | SupabaseDoctor;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DoctorScheduleDialog: React.FC<DoctorScheduleDialogProps> = ({
  doctor,
  open,
  onOpenChange,
}) => {
  // Parse availability
  let availability: DoctorAvailability;
  
  if (isDoctorAvailability(doctor.availability)) {
    availability = doctor.availability;
  } else {
    availability = parseDoctorAvailability(doctor.availability);
  }
    
  const { days, start, end } = availability;

  // Ensure days is treated as an array
  const daysArray = Array.isArray(days) ? days : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Doctor Schedule</DialogTitle>
          <DialogDescription>
            View the availability schedule for {doctor.name}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Calendar className="col-span-1 h-12 w-12 text-muted-foreground" />
            <div className="col-span-3 space-y-1">
              <h4 className="font-semibold">{doctor.name}'s Availability</h4>
              <p className="text-sm text-muted-foreground">
                {daysArray.length === 7 ? (
                  "Available every day"
                ) : (
                  <>
                    Available on:{" "}
                    {daysArray.map((day, index) => (
                      <span key={index}>
                        {day}
                        {index < daysArray.length - 1 ? ", " : ""}
                      </span>
                    ))}
                  </>
                )}
              </p>
              <p className="text-sm text-muted-foreground">
                From {format(new Date(`2000-01-01T${start}`), "h:mm a")} to{" "}
                {format(new Date(`2000-01-01T${end}`), "h:mm a")}
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
