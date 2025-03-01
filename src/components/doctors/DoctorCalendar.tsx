
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { mockDoctors, mockSchedules } from "@/data/doctors";
import { format, isSameDay } from "date-fns";
import { cn } from "@/lib/utils";

export const DoctorCalendar = () => {
  const [selectedDoctor, setSelectedDoctor] = useState<string>(mockDoctors[0]?.id || "");
  const [date, setDate] = useState<Date>(new Date());

  const doctor = mockDoctors.find(d => d.id === selectedDoctor);
  const doctorSchedule = selectedDoctor ? mockSchedules[selectedDoctor] : null;

  // Get schedule for the selected date
  const daySchedule = doctorSchedule?.slots.filter(slot => 
    isSameDay(slot.date, date)
  ).sort((a, b) => a.start.localeCompare(b.start)) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
          <SelectTrigger className="w-full md:w-[250px]">
            <SelectValue placeholder="Select a doctor" />
          </SelectTrigger>
          <SelectContent>
            {mockDoctors.map((doctor) => (
              <SelectItem key={doctor.id} value={doctor.id}>
                {doctor.name} ({doctor.specialty})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {doctor && (
          <div className="flex items-center text-sm text-muted-foreground gap-2">
            <span>Availability:</span>
            {doctor.availability.days.map((day) => (
              <Badge key={day} variant="outline" className="capitalize">
                {day}
              </Badge>
            ))}
            <span className="ml-2">
              {doctor.availability.start} - {doctor.availability.end}
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardContent className="p-4">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => newDate && setDate(newDate)}
              className="rounded-md"
            />
            
            <div className="mt-4 space-y-2">
              <div className="text-sm font-medium">Schedule Legend:</div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-sm">Booked</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                <span className="text-sm">Unavailable</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardContent className="p-4">
            <h3 className="text-lg font-medium mb-4">
              Schedule for {format(date, "EEEE, MMMM d, yyyy")}
            </h3>

            {daySchedule.length > 0 ? (
              <div className="space-y-2">
                {daySchedule.map((slot) => (
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
              <div className="text-center py-8 text-muted-foreground">
                No schedule available for this date.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
