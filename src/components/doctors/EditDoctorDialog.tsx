
import React, { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { departments, specialties } from "@/data/doctors";
import { Doctor, parseDoctorAvailability } from "@/types/doctor";

interface EditDoctorDialogProps {
  doctor: Doctor;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (doctor: Doctor) => void;
}

export const EditDoctorDialog: React.FC<EditDoctorDialogProps> = ({ 
  doctor,
  open, 
  onOpenChange,
  onSave
}) => {
  const availability = parseDoctorAvailability(doctor.availability);
  
  const [formData, setFormData] = useState({
    name: doctor.name,
    specialty: doctor.specialty,
    department: doctor.department,
    email: doctor.email,
    phone: doctor.phone,
    bio: doctor.bio,
    availableDays: availability.days,
    startTime: availability.start,
    endTime: availability.end
  });

  // Update form data when doctor changes
  useEffect(() => {
    const availability = parseDoctorAvailability(doctor.availability);
    setFormData({
      name: doctor.name,
      specialty: doctor.specialty,
      department: doctor.department,
      email: doctor.email,
      phone: doctor.phone,
      bio: doctor.bio,
      availableDays: availability.days,
      startTime: availability.start,
      endTime: availability.end
    });
  }, [doctor]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create updated doctor object
    const updatedDoctor: Doctor = {
      ...doctor,
      name: formData.name,
      specialty: formData.specialty,
      department: formData.department,
      email: formData.email,
      phone: formData.phone,
      bio: formData.bio,
      availability: {
        start: formData.startTime,
        end: formData.endTime,
        days: formData.availableDays,
      }
    };
    
    onSave(updatedDoctor);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Doctor</DialogTitle>
            <DialogDescription>
              Update the doctor's information below.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="department" className="text-right">Department</Label>
              <Select 
                value={formData.department} 
                onValueChange={(value) => handleSelectChange("department", value)}
                required
              >
                <SelectTrigger id="department" className="col-span-3">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="specialty" className="text-right">Specialty</Label>
              <Select 
                value={formData.specialty} 
                onValueChange={(value) => handleSelectChange("specialty", value)}
                required
              >
                <SelectTrigger id="specialty" className="col-span-3">
                  <SelectValue placeholder="Select specialty" />
                </SelectTrigger>
                <SelectContent>
                  {specialties.map((specialty) => (
                    <SelectItem key={specialty} value={specialty}>{specialty}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">Phone</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bio" className="text-right">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                className="col-span-3"
                rows={3}
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Availability</Label>
              <div className="col-span-3 space-y-2">
                <div className="flex flex-wrap gap-2">
                  {["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map((day) => (
                    <Button
                      key={day}
                      type="button"
                      variant={formData.availableDays.includes(day) ? "default" : "outline"}
                      className="capitalize"
                      onClick={() => {
                        if (formData.availableDays.includes(day)) {
                          setFormData(prev => ({
                            ...prev,
                            availableDays: prev.availableDays.filter(d => d !== day)
                          }));
                        } else {
                          setFormData(prev => ({
                            ...prev,
                            availableDays: [...prev.availableDays, day]
                          }));
                        }
                      }}
                    >
                      {day.substring(0, 3)}
                    </Button>
                  ))}
                </div>
                
                <div className="flex gap-4 mt-2">
                  <div className="flex-1">
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input
                      id="startTime"
                      name="startTime"
                      type="time"
                      value={formData.startTime}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="endTime">End Time</Label>
                    <Input
                      id="endTime"
                      name="endTime"
                      type="time"
                      value={formData.endTime}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
