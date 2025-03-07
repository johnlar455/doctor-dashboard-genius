
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Clock, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Appointment } from "@/types/supabase";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Patient, Doctor } from "@/types/supabase";

interface AppointmentFormProps {
  initialData: Appointment | null;
  onSubmit: (appointment: any) => void;
  onCancel: () => void;
}

// Available appointment types
const appointmentTypes = [
  "General Checkup",
  "Consultation",
  "Follow-up",
  "Annual Physical",
  "Specialized Treatment",
  "Urgent Care",
];

// Available time slots
const timeSlots = [
  "08:00 AM", "08:30 AM", "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", 
  "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", 
  "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM",
  "05:00 PM", "05:30 PM"
];

export const AppointmentForm: React.FC<AppointmentFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const [date, setDate] = useState<Date | undefined>(
    initialData?.date ? new Date(initialData.date) : undefined
  );
  const [formData, setFormData] = useState({
    patientId: initialData?.patientId || "",
    doctorId: initialData?.doctorId || "",
    time: initialData?.time || "",
    type: initialData?.type || "",
    notes: initialData?.notes || "",
  });
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoadingPatients, setIsLoadingPatients] = useState(true);
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(true);

  // Fetch patients and doctors from Supabase
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setIsLoadingPatients(true);
        const { data, error } = await supabase
          .from('patients')
          .select('*')
          .order('name');
        
        if (error) throw error;
        setPatients(data || []);
      } catch (error) {
        console.error('Error fetching patients:', error);
        toast.error('Failed to load patients.');
      } finally {
        setIsLoadingPatients(false);
      }
    };

    const fetchDoctors = async () => {
      try {
        setIsLoadingDoctors(true);
        const { data, error } = await supabase
          .from('doctors')
          .select('*')
          .order('name');
        
        if (error) throw error;
        
        // Transform JSON availability to the expected format
        const transformedDoctors = data.map(doctor => ({
          ...doctor,
          availability: typeof doctor.availability === 'string' 
            ? JSON.parse(doctor.availability) 
            : doctor.availability
        }));
        
        setDoctors(transformedDoctors || []);
      } catch (error) {
        console.error('Error fetching doctors:', error);
        toast.error('Failed to load doctors.');
      } finally {
        setIsLoadingDoctors(false);
      }
    };

    fetchPatients();
    fetchDoctors();
  }, []);

  // Get selected patient and doctor
  const selectedPatient = patients.find(p => p.id === formData.patientId);
  const selectedDoctor = doctors.find(d => d.id === formData.doctorId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.patientId || !formData.doctorId || !date || !formData.time || !formData.type) {
      toast.error("Please fill all required fields");
      return;
    }

    // Create appointment data
    const appointmentData = {
      ...(initialData && { id: initialData.id }),
      patientId: formData.patientId,
      patientName: selectedPatient?.name || "",
      doctorId: formData.doctorId,
      doctorName: selectedDoctor?.name || "",
      date: date.toISOString().split('T')[0],
      time: formData.time,
      type: formData.type,
      notes: formData.notes,
      status: initialData?.status || "upcoming",
    };

    onSubmit(appointmentData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const isAvailableTimeSlot = (timeSlot: string) => {
    // In a real app, check against doctor's availability
    // For now, consider all slots available
    return true;
  };

  const isLoading = isLoadingPatients || isLoadingDoctors;

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle>{initialData ? "Edit Appointment" : "Schedule New Appointment"}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading...</span>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Patient Selection */}
                <div className="space-y-2">
                  <Label htmlFor="patientId">Patient</Label>
                  <Select
                    value={formData.patientId}
                    onValueChange={(value) => setFormData({ ...formData, patientId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a patient" />
                    </SelectTrigger>
                    <SelectContent>
                      {patients.map(patient => (
                        <SelectItem key={patient.id} value={patient.id}>
                          {patient.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Doctor Selection */}
                <div className="space-y-2">
                  <Label htmlFor="doctorId">Doctor</Label>
                  <Select
                    value={formData.doctorId}
                    onValueChange={(value) => setFormData({ ...formData, doctorId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      {doctors.map(doctor => (
                        <SelectItem key={doctor.id} value={doctor.id}>
                          {doctor.name} - {doctor.specialty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Date Selection */}
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : "Select a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Time Selection */}
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Select
                    value={formData.time}
                    onValueChange={(value) => setFormData({ ...formData, time: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select time">
                        <div className="flex items-center">
                          <Clock className="mr-2 h-4 w-4" />
                          {formData.time || "Select a time"}
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map(time => (
                        <SelectItem 
                          key={time} 
                          value={time}
                          disabled={!isAvailableTimeSlot(time)}
                        >
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Appointment Type */}
              <div className="space-y-2">
                <Label htmlFor="type">Appointment Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select appointment type" />
                  </SelectTrigger>
                  <SelectContent>
                    {appointmentTypes.map(type => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  placeholder="Add any additional notes or instructions"
                  value={formData.notes}
                  onChange={handleChange}
                  className="min-h-[100px]"
                />
              </div>
            </>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {initialData ? "Update Appointment" : "Schedule Appointment"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
