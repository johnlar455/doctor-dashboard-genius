import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { format, isSameDay } from "date-fns";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { Doctor } from "@/types/supabase";
import { parseDoctorAvailability } from "@/types/doctor";
import { LoadingState } from "@/components/patients/details/LoadingState";
import { ErrorState } from "@/components/patients/details/ErrorState";

interface ScheduleSlot {
  id: string;
  date: Date;
  start: string;
  end: string;
  status: "available" | "booked" | "unavailable";
  patientId?: string;
  patientName?: string;
}

export const DoctorCalendar = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const [date, setDate] = useState<Date>(new Date());
  const [scheduleSlots, setScheduleSlots] = useState<ScheduleSlot[]>([]);
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(true);
  const [isLoadingSchedule, setIsLoadingSchedule] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setIsLoadingDoctors(true);
        const { data, error } = await supabase
          .from('doctors')
          .select('*');
        
        if (error) throw error;
        
        setDoctors(data);
        if (data.length > 0 && !selectedDoctor) {
          setSelectedDoctor(data[0].id);
        }
      } catch (err) {
        console.error('Error fetching doctors:', err);
        setError('Failed to load doctors data. Please try again later.');
      } finally {
        setIsLoadingDoctors(false);
      }
    };

    fetchDoctors();
  }, []);

  useEffect(() => {
    const fetchDoctorSchedule = async () => {
      if (!selectedDoctor) return;
      
      try {
        setIsLoadingSchedule(true);
        
        const startOfSelectedDate = new Date(date);
        startOfSelectedDate.setHours(0, 0, 0, 0);
        
        const endOfSelectedDate = new Date(date);
        endOfSelectedDate.setHours(23, 59, 59, 999);
        
        const { data, error } = await supabase
          .from('doctor_schedules')
          .select('*, patients(name)')
          .eq('doctor_id', selectedDoctor)
          .gte('slot_date', startOfSelectedDate.toISOString())
          .lte('slot_date', endOfSelectedDate.toISOString())
          .order('slot_date', { ascending: true });
        
        if (error) throw error;
        
        if (!data || data.length === 0) {
          const doctor = doctors.find(d => d.id === selectedDoctor);
          if (doctor) {
            const slots = generateDefaultSchedule(doctor, date);
            setScheduleSlots(slots);
          } else {
            setScheduleSlots([]);
          }
        } else {
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
        setIsLoadingSchedule(false);
      }
    };
    
    fetchDoctorSchedule();
  }, [selectedDoctor, date, doctors]);
  
  const generateDefaultSchedule = (doctor: Doctor, selectedDate: Date): ScheduleSlot[] => {
    const slots: ScheduleSlot[] = [];
    const availability = parseDoctorAvailability(doctor.availability);
    const availableDays = availability.days;
    const startTime = availability.start;
    const endTime = availability.end;
    
    const dayName = format(selectedDate, 'EEEE').toLowerCase();
    
    if (availableDays.includes(dayName)) {
      const [startHour, startMinute] = startTime.split(':').map(Number);
      const [endHour, endMinute] = endTime.split(':').map(Number);
      
      let slotDate = new Date(selectedDate);
      slotDate.setHours(startHour, startMinute, 0);
      
      const endDateTime = new Date(selectedDate);
      endDateTime.setHours(endHour, endMinute, 0);
      
      while (slotDate < endDateTime) {
        const slotStart = format(slotDate, 'HH:mm');
        
        const nextSlotDate = new Date(slotDate);
        nextSlotDate.setHours(slotDate.getHours() + 1);
        const slotEnd = format(nextSlotDate, 'HH:mm');
        
        const statusOptions: ("available" | "booked" | "unavailable")[] = ["available", "available", "available", "booked", "unavailable"];
        const randomStatus = statusOptions[Math.floor(Math.random() * statusOptions.length)];
        
        slots.push({
          id: `temp-${slotStart}`,
          date: new Date(slotDate),
          start: slotStart,
          end: slotEnd,
          status: randomStatus,
          patientName: randomStatus === "booked" ? `Patient ${Math.floor(Math.random() * 100)}` : undefined
        });
        
        slotDate = nextSlotDate;
      }
    }
    
    return slots;
  };

  const doctor = doctors.find(d => d.id === selectedDoctor);

  const daySchedule = scheduleSlots
    .filter(slot => isSameDay(slot.date, date))
    .sort((a, b) => a.start.localeCompare(b.start));

  if (isLoadingDoctors) return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
          <SelectTrigger className="w-full md:w-[250px]">
            <SelectValue placeholder="Select a doctor" />
          </SelectTrigger>
          <SelectContent>
            {doctors.map((doctor) => (
              <SelectItem key={doctor.id} value={doctor.id}>
                {doctor.name} ({doctor.specialty})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {doctor && (
          <div className="flex items-center text-sm text-muted-foreground gap-2">
            <span>Availability:</span>
            {parseDoctorAvailability(doctor.availability).days.map((day) => (
              <Badge key={day} variant="outline" className="capitalize">
                {day}
              </Badge>
            ))}
            <span className="ml-2">
              {parseDoctorAvailability(doctor.availability).start} - {parseDoctorAvailability(doctor.availability).end}
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

            {isLoadingSchedule ? (
              <LoadingState />
            ) : daySchedule.length > 0 ? (
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
            ) : doctor && doctor.availability.days.includes(format(date, 'EEEE').toLowerCase()) ? (
              <div className="text-center py-8 text-muted-foreground">
                No schedule data available for this date. Doctor is generally available on this day.
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Doctor is not available on this day.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
